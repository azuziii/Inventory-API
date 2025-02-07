import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductInput {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return String(value);
  })
  price?: string;
}

export class UpdateProductInput extends PartialType(CreateProductInput) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
