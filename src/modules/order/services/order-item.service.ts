import { Injectable } from '@nestjs/common';
import { CreateOrderItemInput } from '../dto/order-item-input.dto';
import { OrderItem } from '../entities/order-item.entity';
import { IOrderItem } from '../interfaces/order-item.interface';
import { OrderItemRepository } from '../repositories/order-item.repository';

@Injectable()
export class OrderItemService implements IOrderItem {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  createOrderItem(input: CreateOrderItemInput): Promise<OrderItem> {
    console.log(1);
    console.log(input);
    console.log(2);
    return this.orderItemRepository.save(input);
  }
}
