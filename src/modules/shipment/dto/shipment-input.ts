import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { carEnum, DestinationEnum } from '../enum/shipment.enum';
import {
  CreateShipmentItemInput,
  CreateShipmentItemInputBulk,
} from './shipment-item-input';

export class CreateShipmentInput {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date!: Date;

  @IsNotEmpty()
  @IsNumber()
  bon!: number;

  @IsNotEmpty()
  @IsNumber()
  travels!: number;

  @IsNotEmpty()
  @IsEnum(carEnum)
  type!: carEnum;

  @IsNotEmpty()
  @IsEnum(DestinationEnum)
  destination!: DestinationEnum;

  @IsNotEmpty()
  customer!: Customer;

  @IsOptional()
  items!: CreateShipmentItemInput[];
}

export class UpdateShipmentInput extends PartialType(CreateShipmentInput) {
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class GetCdnInput {
  @IsNotEmpty()
  @IsString()
  product!: string;

  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  quantity!: number;

  @IsNotEmpty()
  @IsString()
  customer!: string;

  @IsOptional()
  items!: CreateShipmentInput[];
}

export class CreateShipmentInputBulk {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date!: Date;

  @IsNotEmpty()
  @IsNumber()
  bon!: number;

  @IsNotEmpty()
  @IsNumber()
  travels!: number;

  @IsNotEmpty()
  @IsEnum(carEnum)
  type!: carEnum;

  @IsNotEmpty()
  @IsEnum(DestinationEnum)
  destination!: DestinationEnum;

  @IsNotEmpty()
  customer!: string;

  @IsOptional()
  items!: CreateShipmentItemInputBulk[];
}
