import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetProductByIdPipe } from 'src/modules/product/pipes/get-product-by-id/get-product-by-id.pipe';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { CreateOrderItemInput } from '../dto/order-item-input.dto';
import { OrderItemOutput } from '../dto/order-item-output.dto';
import { GetOrderByIdPipe } from '../pipes/get-order-by-id/get-order-by-id.pipe';
import { OrderItemService } from '../services/order-item.service';

@Controller('order/item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  async createOrderItem(
    @Body(GetOrderByIdPipe, GetProductByIdPipe)
    input: CreateOrderItemInput,
  ): Promise<ApiResponse<OrderItemOutput>> {
    const item = await this.orderItemService.createOrderItem(input);
    return {
      data: plainToInstance(OrderItemOutput, item, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Delete(':id')
  deleteOrder(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.orderItemService.deleteOrder(id);
  }
}
