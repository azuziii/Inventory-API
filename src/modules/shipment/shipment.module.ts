import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { ShipmentController } from './controllers/shipment.controller';
import { ShipmentItem } from './entities/shipment-item.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentRepository } from './repositories/shipment.repository';
import { ShipmentService } from './services/shipment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, ShipmentItem]),
    CustomerModule,
    ProductModule,
  ],
  controllers: [ShipmentController],
  providers: [ShipmentService, ShipmentRepository],
})
export class ShipmentModule {}
