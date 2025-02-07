import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateProductInput } from './dto/product-input.dto';
import { ProductOutput } from './dto/product-output.dto';
import { Product } from './entities/product.entity';
import { IProduct } from './interfaces/product.interface';
import { productRepository } from './repositories/product.repository';

@Injectable()
export class ProductService implements IProduct {
  constructor(private readonly productRepository: productRepository) {}

  async createProduct(product: CreateProductInput) {
    const savedProduct = await this.productRepository.save(product);
    return plainToInstance(ProductOutput, savedProduct, {
      excludeExtraneousValues: true,
    });
  }

  find(options?: FindManyOptions<Product>): Promise<Product[]> {
    return this.productRepository.find(options);
  }

  findOne(options: FindOneOptions<Product>): Promise<Product | null> {
    return this.productRepository.findOne(options);
  }

  async listProducts(): Promise<ProductOutput[]> {
    const products = await this.productRepository.find();
    return plainToInstance(ProductOutput, products, {
      excludeExtraneousValues: true,
    });
  }
}
