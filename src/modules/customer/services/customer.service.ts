import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType } from 'src/modules/activity_log/enum/activity-types.enum';
import { IActivityLog } from 'src/modules/activity_log/interface/activity-log.interface';
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
  constructor(
    private readonly customerRepository: CustomerRepository,
    @Inject(IActivityLog) private readonly activityLogService: IActivityLog,
  ) {}

  async createCustomer(customer: CreateCustomerInput): Promise<Customer> {
    const savedCustomer = await this.customerRepository.save(customer);

    await this.activityLogService.log({
      entity_id: savedCustomer.id,
      new_data: JSON.stringify(savedCustomer),
      table_name: this.customerRepository.metadata.name,
      type: ActivityType.Created,
    });

    return savedCustomer;
  }

  bulkCreate(products: CreateCustomerInput[]) {
    return Promise.all(
      products.map((p) => {
        this.customerRepository.save(p);
      }),
    );
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

    const savedCustomer = await this.customerRepository.save({
      ...customer,
      ...input,
    });

    await this.activityLogService.log({
      entity_id: savedCustomer.id,
      old_data: JSON.stringify(customer),
      new_data: JSON.stringify(savedCustomer),
      table_name: this.customerRepository.metadata.name,
      type: ActivityType.Updated,
    });

    return savedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    await this.activityLogService.log({
      entity_id: id,
      old_data: JSON.stringify(customer || {}),
      table_name: this.customerRepository.metadata.name,
      type: ActivityType.Deleted,
    });

    await this.customerRepository.delete(id);
  }
}
