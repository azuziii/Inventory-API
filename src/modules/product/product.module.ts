import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { IProduct } from './interfaces/product.interface';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { productRepository } from './repositories/product.repository';

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
