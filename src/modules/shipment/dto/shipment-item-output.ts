import { Expose, Type } from 'class-transformer';
import { ProductOutput } from 'src/modules/product/dto/product-output.dto';

export class ShipmentItemOutput {
  @Expose()
  id!: string;

  @Expose()
  cdn!: string;

  @Expose()
  quantity!: number;

  @Expose()
  @Type(() => ProductOutput)
  product!: ProductOutput;
}
