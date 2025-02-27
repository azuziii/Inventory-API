import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogModule } from '../activity_log/activity_log.module';
import { CustomerController } from './controllers/customer.controller';
import { Customer } from './entities/customer.entity';
import { ICustomer } from './interfaces/customer.interface';
import { CustomerRepository } from './repositories/customer.repository';
import { CustomerService } from './services/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), ActivityLogModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerRepository,
    {
      provide: ICustomer,
      useExisting: CustomerService,
    },
  ],
  exports: [ICustomer],
})
export class CustomerModule {}
