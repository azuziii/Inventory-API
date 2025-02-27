import { Expose, Type } from 'class-transformer';
import { ProductOutput } from 'src/modules/product/dto/product-output.dto';

export class OrderItemOutput {
  @Expose()
  id!: string;

  @Expose()
  isDone!: boolean;

  @Expose()
  quantity!: number;

  @Expose()
  quantity_left!: number;

  @Expose()
  remaining!: number;

  @Expose()
  @Type(() => ProductOutput)
  product!: ProductOutput;
}
