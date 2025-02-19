import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { carEnum, DestinationEnum } from '../enum/shipment.enum';

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
}

export class UpdateShipmentInput extends PartialType(CreateShipmentInput) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
