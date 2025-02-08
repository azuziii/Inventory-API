import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { OrderItemController } from './controllers/order-item.controller';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { IOrderItem } from './interfaces/order-item.interface';
import { IOrder } from './interfaces/order.interface';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderRepository } from './repositories/order.repository';
import { OrderItemService } from './services/order-item.service';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItemRepository]),
    CustomerModule,
    ProductModule,
  ],
  controllers: [OrderController, OrderItemController],
  providers: [
    OrderService,
    OrderRepository,
    {
      provide: IOrder,
      useExisting: OrderService,
    },
    OrderItemService,
    OrderItemRepository,
    {
      provide: IOrderItem,
      useExisting: OrderItemService,
    },
  ],
})
export class OrderModule {}
