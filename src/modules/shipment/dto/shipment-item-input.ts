import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Product } from 'src/modules/product/entities/product.entity';
import { Shipment } from '../entities/shipment.entity';

export class CreateShipmentItemInput {
  @IsNotEmpty()
  product!: Product;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  quantity?: number;

  @IsOptional()
  @IsString()
  cdn?: string;

  @IsNotEmpty()
  shipment!: Shipment;
}

export class UpdateShipmentitemInput extends PartialType(
  CreateShipmentItemInput,
) {
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class CreateShipmentItemInputBulk {
  @IsNotEmpty()
  product!: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  quantity?: number;

  @IsOptional()
  @IsString()
  cdn?: string;

  @IsNotEmpty()
  shipment!: Shipment;
}
