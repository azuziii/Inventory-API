import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  CreateProductInput,
  UpdateProductInput,
} from './dto/product-input.dto';
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

  async getProduct(id: string): Promise<ProductOutput | null> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    return plainToInstance(ProductOutput, product);
  }

  async updateProduct(input: UpdateProductInput): Promise<Product> {
    const { id } = input;

    if (!id) {
      throw new BadRequestException('Product id is required');
    }

    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(product, input);

    return this.productRepository.save(product);
  }
}
