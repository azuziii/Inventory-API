import { Expose, Type } from 'class-transformer';
import { CustomerOutput } from 'src/modules/customer/dto/customer-output.dto';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { carEnum, DestinationEnum } from '../enum/shipment.enum';
import { ShipmentItemOutput } from './shipment-item-output';

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
  @Type(() => CustomerOutput)
  customer!: Customer;

  @Expose()
  @Type(() => ShipmentItemOutput)
  shipments!: ShipmentItemOutput[];
}
