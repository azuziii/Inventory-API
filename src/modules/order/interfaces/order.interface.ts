import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Order } from '../entities/order.entity';

export const IOrder = 'IOrder';

export interface IOrder {
  find(options?: FindManyOptions<Order>): Promise<Order[]>;
  findOne(options: FindOneOptions<Order>): Promise<Order | null>;
}
