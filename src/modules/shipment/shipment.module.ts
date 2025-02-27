import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogModule } from '../activity_log/activity_log.module';
import { CustomerModule } from '../customer/customer.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { ShipmentItemController } from './controllers/shipment-item.controller';
import { ShipmentController } from './controllers/shipment.controller';
import { ShipmentItem } from './entities/shipment-item.entity';
import { Shipment } from './entities/shipment.entity';
import { IShipmentItem } from './interfaces/shipment-item.interface';
import { IShipment } from './interfaces/shipment.interface';
import { ShipmentItemService } from './services/shipment-item.service';
import { ShipmentService } from './services/shipment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, ShipmentItem]),
    CustomerModule,
    ProductModule,
    OrderModule,
    ActivityLogModule,
  ],
  controllers: [ShipmentController, ShipmentItemController],
  providers: [
    ShipmentService,
    {
      provide: IShipment,
      useExisting: ShipmentService,
    },
    ShipmentItemService,
    {
      provide: IShipmentItem,
      useExisting: ShipmentItemService,
    },
  ],
  exports: [IShipment, IShipmentItem],
})
export class ShipmentModule {}
