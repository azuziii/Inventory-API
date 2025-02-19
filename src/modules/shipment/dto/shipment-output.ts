import { Expose } from 'class-transformer';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { ShipmentItem } from '../entities/shipment-item.entity';
import { carEnum, DestinationEnum } from '../enum/shipment.enum';

export class ShipmentOutput {
  @Expose()
  id!: string;

  @Expose()
  date!: Date;

  @Expose()
  bon!: number;

  @Expose()
  travels!: number;

  @Expose()
  type!: carEnum;

  @Expose()
  destination!: DestinationEnum;

  @Expose()
  customer!: Customer;

  @Expose()
  shipments!: ShipmentItem[];
}
