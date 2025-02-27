import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Product } from 'src/modules/product/entities/product.entity';
import { Order } from '../entities/order.entity';

export class CreateOrderItemInput {
  @IsNotEmpty()
  product!: Product;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  quantity!: number;

  @IsNotEmpty()
  order!: Order;
}

export class UpdateOrderItem extends PartialType(CreateOrderItemInput) {
  @IsOptional()
  @IsUUID()
  id!: string;
}

export class CreateOrderItemInputBulk {
  @IsNotEmpty()
  product!: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  quantity!: number;

  @IsNotEmpty()
  order!: Order;
}
