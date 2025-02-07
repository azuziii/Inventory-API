import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { IProduct } from './interfaces/product.interface';
import { productRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
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
