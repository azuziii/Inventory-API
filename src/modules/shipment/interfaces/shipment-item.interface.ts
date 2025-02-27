import {
  CreateShipmentItemInput,
  CreateShipmentItemInputBulk,
} from '../dto/shipment-item-input';
import { ShipmentItem } from '../entities/shipment-item.entity';

export const IShipmentItem = 'IShipmentItem';

export interface IShipmentItem {
  createShipmentItem(input: CreateShipmentItemInput): Promise<ShipmentItem>;
  createShipmentItemBulk(input: CreateShipmentItemInputBulk[]): Promise<void>;
}
