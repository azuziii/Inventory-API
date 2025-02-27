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
  CreateShipmentInput,
  CreateShipmentInputBulk,
  GetCdnInput,
  UpdateShipmentInput,
} from '../dto/shipment-input';
import { ShipmentOutput } from '../dto/shipment-output';
import { ShipmentService } from '../services/shipment.service';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post('bulk')
  bulkCreate(@Body() input: CreateShipmentInputBulk[]) {
    return this.shipmentService.bulkCreate(input);
  }

  @Post('calc')
  async getCdn(@Body() input: GetCdnInput) {
    const result = await this.shipmentService.getCdn(input);
    return {
      data: result,
      meta: {},
    };
  }

  @Post()
  async createShipment(
    @Body(GetCustomerByIdPipe)
    input: CreateShipmentInput,
  ): Promise<ApiResponse<ShipmentOutput>> {
    const shipment = await this.shipmentService.createShipment(input);
    return {
      data: plainToInstance(ShipmentOutput, shipment, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Get()
  async listShipments(): Promise<ApiResponse<ShipmentOutput[]>> {
    const [shipments, count] = await this.shipmentService.listShipments();

    return {
      data: plainToInstance(ShipmentOutput, shipments, {
        excludeExtraneousValues: true,
      }),
      meta: { count },
    };
  }

  @Get(':id')
  async getShipment(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<ShipmentOutput | null>> {
    const shipment = await this.shipmentService.getShipment(id);

    return {
      data: plainToInstance(ShipmentOutput, shipment, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch(':id')
  async updateShipmentById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(GetCustomerByIdPipe)
    input: UpdateShipmentInput,
  ): Promise<ApiResponse<ShipmentOutput>> {
    const shipment = await this.shipmentService.updateShipment({
      ...input,
      id,
    });

    return {
      data: plainToInstance(ShipmentOutput, shipment, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch()
  async updateShipmentByBody(
    @Body(GetCustomerByIdPipe)
    input: UpdateShipmentInput,
  ): Promise<ApiResponse<ShipmentOutput>> {
    const shipment = await this.shipmentService.updateShipment(input);

    return {
      data: plainToInstance(ShipmentOutput, shipment, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Delete(':id')
  deleteShipment(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shipmentService.deleteShipment(id);
  }
}
