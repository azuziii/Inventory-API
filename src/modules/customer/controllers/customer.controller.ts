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
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../dto/customer-input.dto';
import { CustomerOutput } from '../dto/customer-output.dto';
import { CustomerExistsPipe } from '../pipes/customer_exists/customer_exists.pipe';
import { CustomerIceExistsPipe } from '../pipes/ice_exists/ice_exists.pipe';
import { CustomerService } from '../services/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body(CustomerExistsPipe, CustomerIceExistsPipe) input: CreateCustomerInput,
  ): Promise<ApiResponse<CustomerOutput>> {
    const customer = await this.customerService.createCustomer(input);

    return {
      data: plainToInstance(CustomerOutput, customer, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Get()
  async listCustomers(): Promise<ApiResponse<CustomerOutput[]>> {
    const [customers, count] = await this.customerService.listCustomers();

    return {
      data: plainToInstance(CustomerOutput, customers, {
        excludeExtraneousValues: true,
      }),
      meta: { count },
    };
  }

  @Get(':id')
  async getCustomer(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<CustomerOutput | null>> {
    const customer = await this.customerService.getCustomer(id);

    return {
      data: plainToInstance(CustomerOutput, customer, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch(':id')
  async updateCustomerById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(CustomerExistsPipe, CustomerIceExistsPipe) input: UpdateCustomerInput,
  ): Promise<ApiResponse<CustomerOutput>> {
    const customer = await this.customerService.updateCustomer({
      ...input,
      id,
    });

    return {
      data: plainToInstance(CustomerOutput, customer, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch()
  async updateCustomerByBody(
    @Body(CustomerExistsPipe, CustomerIceExistsPipe) input: UpdateCustomerInput,
  ): Promise<ApiResponse<CustomerOutput>> {
    const customer = await this.customerService.updateCustomer(input);

    return {
      data: plainToInstance(CustomerOutput, customer, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Delete(':id')
  deleteCustomer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customerService.deleteCustomer(id);
  }
}
