import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../dto/customer-input.dto';
import { CustomerOutput } from '../dto/customer-output.dto';
import { Customer } from '../entities/customer.entity';
import { ICustomer } from '../interfaces/customer.interface';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class CustomerService implements ICustomer {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(customer: CreateCustomerInput) {
    const savedCustomer = await this.customerRepository.save(customer);
    return plainToInstance(CustomerOutput, savedCustomer, {
      excludeExtraneousValues: true,
    });
  }

  find(options?: FindManyOptions<Customer>): Promise<Customer[]> {
    return this.customerRepository.find(options);
  }

  findOne(options: FindOneOptions<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne(options);
  }

  async listCustomers(): Promise<{ result: CustomerOutput[]; count: number }> {
    const [customers, count] = await this.customerRepository.findAndCount();
    return {
      result: plainToInstance(CustomerOutput, customers, {
        excludeExtraneousValues: true,
      }),
      count,
    };
  }

  async getCustomer(id: string): Promise<CustomerOutput | null> {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return plainToInstance(CustomerOutput, customer, {
      excludeExtraneousValues: true,
    });
  }

  async updateCustomer(input: UpdateCustomerInput): Promise<Customer> {
    const isEmpty = Object.keys(input).length === 0;

    if (isEmpty) {
      throw new BadRequestException('No fields provided for update');
    }

    const { id } = input;

    if (!id) {
      throw new BadRequestException('Customer id is required');
    }

    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    Object.assign(customer, input);
    const savedCustomer = await this.customerRepository.save(customer);

    return plainToInstance(CustomerOutput, savedCustomer, {
      excludeExtraneousValues: true,
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
