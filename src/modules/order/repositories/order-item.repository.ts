import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {
    super(OrderItem, entityManager);
  }
}
