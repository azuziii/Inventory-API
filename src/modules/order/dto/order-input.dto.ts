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
import {
  CreateOrderItemInput,
  CreateOrderItemInputBulk,
} from './order-item-input.dto';

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

  @IsOptional()
  orders?: CreateOrderItemInput[];
}

export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
export class CreateOrderInputBulk {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date!: Date;

  @IsNotEmpty()
  @IsString()
  cdn!: string;

  @IsNotEmpty()
  customer!: string;

  @IsOptional()
  orders?: CreateOrderItemInputBulk[];
}
