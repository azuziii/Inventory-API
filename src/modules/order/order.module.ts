import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { IOrder } from './interfaces/order.interface';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), CustomerModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    {
      provide: IOrder,
      useExisting: OrderService,
    },
  ],
})
export class OrderModule {}
