import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class productRepository extends Repository<Product> {
  constructor(@Inject() entityManager: EntityManager) {
    super(Product, entityManager);
  }
}
