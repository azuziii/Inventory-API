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
import { GetProductByIdPipe } from 'src/modules/product/pipes/get-product-by-id/get-product-by-id.pipe';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import {
  CreateShipmentItemInput,
  UpdateShipmentitemInput,
} from '../dto/shipment-item-input';
import { ShipmentItemOutput } from '../dto/shipment-item-output';
import { GetShipmentByIdPipe } from '../pipes/get-shipment-by-id/get-shipment-by-id.pipe';
import { ShipmentItemService } from '../services/shipment-item.service';

@Controller('shipment/item')
export class ShipmentItemController {
  constructor(private readonly shipmentItemService: ShipmentItemService) {}

  @Get()
  a() {
    return this.shipmentItemService.find();
  }

  @Post()
  async createShipmentItem(
    @Body(GetShipmentByIdPipe, GetProductByIdPipe)
    input: CreateShipmentItemInput,
  ): Promise<ApiResponse<ShipmentItemOutput>> {
    const item = await this.shipmentItemService.createShipmentItem(input);
    return {
      data: plainToInstance(ShipmentItemOutput, item, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch()
  async editShipmentItem(
    @Body(GetProductByIdPipe)
    input: UpdateShipmentitemInput,
  ): Promise<ApiResponse<ShipmentItemOutput>> {
    const item = await this.shipmentItemService.editShipmentItem(input);
    return {
      data: plainToInstance(ShipmentItemOutput, item, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Delete(':id')
  deleteShipment(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shipmentItemService.deleteShipment(id);
  }
}
