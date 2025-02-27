import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetCustomerByIdPipe } from 'src/modules/customer/pipes/get-customer-by-id/get-customer-by-id.pipe';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import {
  CreateOrderInput,
  CreateOrderInputBulk,
  UpdateOrderInput,
} from '../dto/order-input.dto';
import { OrderOutput } from '../dto/order-output.dto';
import { OrderCdnExistsPipe } from '../pipes/cdn_exists/cdn_exists.pipe';
import { OrderService } from '../services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('bulk')
  bulkCreate(@Body() input: CreateOrderInputBulk[]) {
    return this.orderService.bulkCreate(input);
  }

  @Post()
  async createOrder(
    @Body(OrderCdnExistsPipe, GetCustomerByIdPipe) input: CreateOrderInput,
  ): Promise<ApiResponse<OrderOutput>> {
    const order = await this.orderService.createOrder(input);
    return {
      data: plainToInstance(OrderOutput, order, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Get()
  async listOrders(): Promise<ApiResponse<OrderOutput[]>> {
    const [orders, count] = await this.orderService.listOrders();

    return {
      data: plainToInstance(OrderOutput, orders, {
        excludeExtraneousValues: true,
      }),
      meta: { count },
    };
  }

  @Get(':id')
  async getOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<OrderOutput | null>> {
    const order = await this.orderService.getOrder(id);

    return {
      data: plainToInstance(OrderOutput, order, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch(':id')
  async updateOrderById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(OrderCdnExistsPipe, GetCustomerByIdPipe) input: UpdateOrderInput,
  ): Promise<ApiResponse<OrderOutput>> {
    const order = await this.orderService.updateOrder({
      ...input,
      id,
    });

    return {
      data: plainToInstance(OrderOutput, order, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch()
  async updateOrderByBody(
    @Body(OrderCdnExistsPipe, GetCustomerByIdPipe) input: UpdateOrderInput,
  ): Promise<ApiResponse<OrderOutput>> {
    const order = await this.orderService.updateOrder(input);

    return {
      data: plainToInstance(OrderOutput, order, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Delete(':id')
  deleteOrder(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}
