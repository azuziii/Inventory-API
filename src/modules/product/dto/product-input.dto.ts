import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductInput {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @Transform(({ value }) => String(value))
  @IsNumberString()
  price?: string;
}

export class UpdateProductInput extends PartialType(CreateProductInput) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
