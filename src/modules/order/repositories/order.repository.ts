import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {
    super(Order, entityManager);
  }
}
