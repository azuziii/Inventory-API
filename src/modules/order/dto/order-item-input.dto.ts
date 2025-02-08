import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Product } from 'src/modules/product/entities/product.entity';
import { Order } from '../entities/order.entity';

export class CreateOrderItemInput {
  @IsNotEmpty()
  product!: Product;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  order!: Order;
}

export class UpdateOrderItem extends PartialType(CreateOrderItemInput) {
  @IsOptional()
  @IsUUID()
  id!: string;
}
