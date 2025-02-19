import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Shipment } from '../entities/shipment.entity';

@Injectable()
export class ShipmentRepository extends Repository<Shipment> {
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {
    super(Shipment, entityManager);
  }
}
