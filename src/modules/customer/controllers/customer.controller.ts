import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../dto/customer-input.dto';
import { CustomerOutput } from '../dto/customer-output.dto';
import { CustomerExistsPipe } from '../pipes/customer_exists/customer_exists.pipe';
import { CustomerService } from '../services/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UsePipes(CustomerExistsPipe)
  async createCustomer(
    @Body() input: CreateCustomerInput,
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
    const { result, count } = await this.customerService.listCustomers();

    return {
      data: result,
      meta: { count },
    };
  }

  @Get(':id')
  async getCustomer(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<CustomerOutput | null>> {
    const customer = await this.customerService.getCustomer(id);

    return {
      data: customer,
      meta: {},
    };
  }

  @Patch(':id')
  async updateCustomerById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateCustomerInput,
  ): Promise<ApiResponse<CustomerOutput>> {
    const customer = await this.customerService.updateCustomer({
      ...input,
      id,
    });

    return {
      data: customer,
      meta: {},
    };
  }

  @Patch()
  async updateCustomerByBody(
    @Body() input: UpdateCustomerInput,
  ): Promise<ApiResponse<CustomerOutput>> {
    const result = await this.customerService.updateCustomer(input);

    return {
      data: result,
      meta: {},
    };
  }

  @Delete(':id')
  deleteCustomer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customerService.deleteCustomer(id);
  }
}
