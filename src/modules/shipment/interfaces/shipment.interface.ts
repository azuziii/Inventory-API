import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Shipment } from '../entities/shipment.entity';

export const IShipment = 'IShipment';

export interface IShipment {
  find(options?: FindManyOptions<Shipment>): Promise<Shipment[]>;
  findOne(options: FindOneOptions<Shipment>): Promise<Shipment | null>;
}
