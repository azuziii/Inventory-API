import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogModule } from '../activity_log/activity_log.module';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { IProduct } from './interfaces/product.interface';
import { productRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ActivityLogModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    productRepository,
    {
      provide: IProduct,
      useExisting: ProductService,
    },
  ],
  exports: [IProduct],
})
export class ProductModule {}
