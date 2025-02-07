import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
