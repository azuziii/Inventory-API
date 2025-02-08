import { Expose, Type } from 'class-transformer';
import { CustomerOutput } from 'src/modules/customer/dto/customer-output.dto';

export class OrderOutput {
  #minimal = true;

  @Expose()
  id!: string;

  @Expose()
  date!: Date;

  @Expose()
  cdn!: string;

  @Expose()
  @Type(() => CustomerOutput)
  customer!: CustomerOutput;
}
