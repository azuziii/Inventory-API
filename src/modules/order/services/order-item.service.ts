import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  createOrderItem(input: CreateOrderItemInput): Promise<OrderItem> {
    return this.orderItemRepository.save(input);
  }

  editOrderItem(input: UpdateOrderInput): Promise<OrderItem> {
    return this.orderItemRepository.save(input);
  }

  async updateQuantity(
    cdn: string,
    productId: string,
    quantity: number,
  ): Promise<any> {
    console.log(cdn, productId, quantity);
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

        await transactionalEntityManager.save(OrderItem, {
          ...orderItem,
          quantity_left: orderItem.quantity_left + quantity,
        });
      },
    );
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderItemRepository.delete(id);
  }
}
