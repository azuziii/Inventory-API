import { Expose } from 'class-transformer';

export class CustomerOutput {
  #nominal = true;

  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  ice!: string;

  @Expose()
  address!: string;

  @Expose()
  city!: string;
}
