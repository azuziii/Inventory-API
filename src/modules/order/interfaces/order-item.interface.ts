import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  CreateOrderItemInput,
  CreateOrderItemInputBulk,
} from '../dto/order-item-input.dto';
import { OrderItem } from '../entities/order-item.entity';

export const IOrderItem = 'IOrderItem';

export interface IOrderItem {
  find(options?: FindManyOptions<OrderItem>): Promise<OrderItem[]>;
  findOne(options: FindOneOptions<OrderItem>): Promise<OrderItem | null>;
  createOrderItem(input: CreateOrderItemInput): Promise<OrderItem>;
  updateQuantity(
    cdn: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItem>;
  createOrderItemBulk(input: CreateOrderItemInputBulk[]): Promise<void>;
}
