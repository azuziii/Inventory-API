import { Expose } from 'class-transformer';

export class ProductOutput {
  @Expose()
  name!: string;

  @Expose()
  price!: string;
}
