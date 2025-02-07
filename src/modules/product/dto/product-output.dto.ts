import { Expose } from 'class-transformer';

export class ProductOutput {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  price!: string;
}
