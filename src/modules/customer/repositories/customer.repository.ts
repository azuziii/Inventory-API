import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository extends Repository<Customer> {
  constructor(@Inject() entityManager: EntityManager) {
    super(Customer, entityManager);
  }
}
