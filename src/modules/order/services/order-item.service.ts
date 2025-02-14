import { Injectable } from '@nestjs/common';
import { UpdateOrderInput } from '../dto/order-input.dto';
import { CreateOrderItemInput } from '../dto/order-item-input.dto';
import { OrderItem } from '../entities/order-item.entity';
import { IOrderItem } from '../interfaces/order-item.interface';
import { OrderItemRepository } from '../repositories/order-item.repository';

@Injectable()
export class OrderItemService implements IOrderItem {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  createOrderItem(input: CreateOrderItemInput): Promise<OrderItem> {
    return this.orderItemRepository.save(input);
  }

  editOrderItem(input: UpdateOrderInput): Promise<OrderItem> {
    return this.orderItemRepository.save(input);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderItemRepository.delete(id);
  }
}
