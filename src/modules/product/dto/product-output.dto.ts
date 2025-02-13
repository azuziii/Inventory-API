import { Expose } from 'class-transformer';

export class ProductOutput {
  #nominal = true;

  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  price!: string;

  @Expose()
  errors!: any[];
}
