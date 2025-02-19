import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ShipmentItem } from '../entities/shipment-item.entity';

@Injectable()
export class ShipmentItemRepository extends Repository<ShipmentItem> {
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {
    super(ShipmentItem, entityManager);
  }
}
