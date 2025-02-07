import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Product } from '../entities/product.entity';

export const IProduct = 'IProduct';

export interface IProduct {
  find(options?: FindManyOptions<Product>): Promise<Product[]>;
  findOne(options: FindOneOptions<Product>): Promise<Product | null>;
}
