import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityType } from 'src/modules/activity_log/enum/activity-types.enum';
import { IActivityLog } from 'src/modules/activity_log/interface/activity-log.interface';
import { IProduct } from 'src/modules/product/interfaces/product.interface';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UpdateOrderInput } from '../dto/order-input.dto';
import { CreateOrderItemInput } from '../dto/order-item-input.dto';
import { OrderItem } from '../entities/order-item.entity';
import { IOrderItem } from '../interfaces/order-item.interface';
import { IOrder } from '../interfaces/order.interface';

@Injectable()
export class OrderItemService implements IOrderItem {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject(IProduct) private readonly productService: IProduct,
    @Inject(forwardRef(() => IOrder)) private readonly orderService: IOrder,
    @Inject(IActivityLog) private readonly activityLogService: IActivityLog,
  ) {}

  findOne(options: FindOneOptions<OrderItem>): Promise<OrderItem | null> {
    return this.orderItemRepository.findOne(options);
  }

  async createOrderItemBulk(input: any[]): Promise<void> {
    for (let item of input) {
      const product = await this.productService.findOne({
        where: { name: item.product },
      });

      const order = await this.orderService.findOne({
        where: { id: item.iid },
      });

      await this.orderItemRepository.save({
        ...item,
        product,
        order,
        // quantity_left: item.quantity,
      } as CreateOrderItemInput);
    }
  }

  async find(options?: FindManyOptions<OrderItem>): Promise<OrderItem[]> {
    const f = await this.orderItemRepository.find(options);
    await Promise.all(
      f
        .map((x) => ({ ...x, quantity_left: x.quantity }))
        .map((x) => this.orderItemRepository.save(x)),
    );
    return this.orderItemRepository.find(options);
  }

  async createOrderItem(input: CreateOrderItemInput): Promise<OrderItem> {
    const savedItem = await this.orderItemRepository.save(input);

    await this.activityLogService.log({
      entity_id: savedItem.id,
      new_data: JSON.stringify(savedItem),
      table_name: this.orderItemRepository.metadata.name,
      type: ActivityType.ItemCreated,
    });

    return savedItem;
  }

  async editOrderItem(input: UpdateOrderInput): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: input.id! },
    });

    const savedItem = await this.orderItemRepository.save(input);

    await this.activityLogService.log({
      entity_id: savedItem.id,
      old_data: JSON.stringify(orderItem),
      new_data: JSON.stringify(savedItem),
      table_name: this.orderItemRepository.metadata.name,
      type: ActivityType.Updated,
    });

    return savedItem;
  }

  async updateQuantity(
    cdn: string,
    productId: string,
    quantity: number,
  ): Promise<any> {
    return this.orderItemRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const orderItem = await transactionalEntityManager.findOne(OrderItem, {
          where: {
            product: {
              name: productId,
            },
            order: {
              cdn,
            },
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (!orderItem) {
          return;
        }

        const savedItem = await transactionalEntityManager.save(OrderItem, {
          ...orderItem,
          quantity_left: orderItem.quantity_left + quantity,
        });

        await this.activityLogService.log({
          entity_id: savedItem.id,
          old_data: JSON.stringify(orderItem),
          new_data: JSON.stringify(savedItem),
          table_name: this.orderItemRepository.metadata.name,
          type: ActivityType.Auto_update,
        });
      },
    );
  }

  async deleteOrder(id: string): Promise<void> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id } });

    await this.activityLogService.log({
      entity_id: id,
      old_data: JSON.stringify(orderItem || {}),
      table_name: this.orderItemRepository.metadata.name,
      type: ActivityType.Deleted,
    });

    await this.orderItemRepository.delete(id);
  }
}
