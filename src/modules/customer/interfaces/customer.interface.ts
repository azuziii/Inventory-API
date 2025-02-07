import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Customer } from '../entities/customer.entity';

export const ICustomer = 'ICustomer';

export interface ICustomer {
  find(options?: FindManyOptions<Customer>): Promise<Customer[]>;
  findOne(options: FindOneOptions<Customer>): Promise<Customer | null>;
}
