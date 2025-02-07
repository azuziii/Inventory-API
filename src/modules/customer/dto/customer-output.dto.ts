import { Expose } from 'class-transformer';

export class CustomerOutput {
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
