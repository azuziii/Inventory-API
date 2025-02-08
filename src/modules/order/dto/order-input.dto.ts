import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Customer } from 'src/modules/customer/entities/customer.entity';

export class CreateOrderInput {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date!: Date;

  @IsNotEmpty()
  @IsString()
  cdn!: string;

  @IsNotEmpty()
  customer!: Customer;
}

export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
