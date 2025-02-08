import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../dto/customer-input.dto';
import { Customer } from '../entities/customer.entity';
import { ICustomer } from '../interfaces/customer.interface';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class CustomerService implements ICustomer {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(customer: CreateCustomerInput): Promise<Customer> {
    return this.customerRepository.save(customer);
  }

  find(options?: FindManyOptions<Customer>): Promise<Customer[]> {
    return this.customerRepository.find(options);
  }

  findOne(options: FindOneOptions<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne(options);
  }

  listCustomers(): Promise<[Customer[], number]> {
    return this.customerRepository.findAndCount();
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async updateCustomer(input: UpdateCustomerInput): Promise<Customer> {
    const { id } = input;

    if (!id) {
      throw new BadRequestException('Customer id is required');
    }

    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const isEmpty = Object.keys(input).length === 1;

    if (isEmpty) {
      throw new BadRequestException('No fields provided for update');
    }

    Object.assign(customer, input);
    const savedCustomer = await this.customerRepository.save(customer);

    return savedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
