import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityType } from 'src/modules/activity_log/enum/activity-types.enum';
import { IActivityLog } from 'src/modules/activity_log/interface/activity-log.interface';
import { ICustomer } from 'src/modules/customer/interfaces/customer.interface';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import {
  CreateOrderInput,
  CreateOrderInputBulk,
  UpdateOrderInput,
} from '../dto/order-input.dto';
import { Order } from '../entities/order.entity';
import { IOrderItem } from '../interfaces/order-item.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(ICustomer) private readonly customerService: ICustomer,
    @Inject(IOrderItem) private readonly orderItemService: IOrderItem,
    @Inject(IActivityLog) private readonly activityLogService: IActivityLog,
  ) {}

  async createOrder(order: CreateOrderInput): Promise<Order> {
    const savedOrder = await this.orderRepository.save(order);

    await this.activityLogService.log({
      entity_id: savedOrder.id,
      new_data: JSON.stringify(savedOrder),
      table_name: this.orderRepository.metadata.name,
      type: ActivityType.Created,
    });

    return savedOrder;
  }

  async bulkCreate(shipments: CreateOrderInputBulk[]) {
    for (let i = 0; i < shipments.length; i++) {
      const order = shipments[i]!;
      const customer = await this.customerService.findOne({
        where: { name: order.customer },
      });

      const savedShipment = await this.orderRepository.save({
        ...({
          customer,
          cdn: order.cdn,
          date: order.date,
        } as CreateOrderInput),
      });

      await this.orderItemService.createOrderItemBulk(
        order.orders!.map((x) => ({
          ...x,
          shipment: savedShipment,
          iid: savedShipment.id,
        })),
      );
    }
  }

  find(options?: FindManyOptions<Order>): Promise<Order[]> {
    return this.orderRepository.find(options);
  }

  findOne(options: FindOneOptions<Order>): Promise<Order | null> {
    return this.orderRepository.findOne(options);
  }

  listOrders(): Promise<[Order[], number]> {
    return this.orderRepository.findAndCount({
      relations: {
        customer: true,
        orders: true,
      },
      order: {
        date: 'DESC',
      },
    });
  }

  async getOrder(id: string): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        orders: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrder(input: UpdateOrderInput): Promise<Order | null> {
    const { id } = input;

    if (!id) {
      throw new BadRequestException('Order id is required');
    }

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const isEmpty = Object.keys(input).length === 1;

    if (isEmpty) {
      return this.orderRepository.findOne({ where: { id } });
    }

    const savedOrder = await this.orderRepository.save({ ...order, ...input });

    await this.activityLogService.log({
      entity_id: savedOrder.id,
      old_data: JSON.stringify(order),
      new_data: JSON.stringify(savedOrder),
      table_name: this.orderRepository.metadata.name,
      type: ActivityType.Updated,
    });

    return savedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });

    await this.activityLogService.log({
      entity_id: id,
      old_data: JSON.stringify(order || {}),
      table_name: this.orderRepository.metadata.name,
      type: ActivityType.Deleted,
    });

    await this.orderRepository.delete(id);
  }
}
