import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogModule } from '../activity_log/activity_log.module';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { OrderItemController } from './controllers/order-item.controller';
import { OrderController } from './controllers/order.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { IOrderItem } from './interfaces/order-item.interface';
import { IOrder } from './interfaces/order.interface';
import { OrderItemService } from './services/order-item.service';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CustomerModule,
    ProductModule,
    ActivityLogModule,
  ],
  controllers: [OrderController, OrderItemController],
  providers: [
    OrderService,
    {
      provide: IOrder,
      useExisting: OrderService,
    },
    OrderItemService,
    {
      provide: IOrderItem,
      useExisting: OrderItemService,
    },
  ],
  exports: [IOrder, IOrderItem],
})
export class OrderModule {}
