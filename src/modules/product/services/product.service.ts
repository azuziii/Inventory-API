import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  CreateProductInput,
  UpdateProductInput,
} from '../dto/product-input.dto';
import { Product } from '../entities/product.entity';
import { IProduct } from '../interfaces/product.interface';
import { productRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService implements IProduct {
  constructor(private readonly productRepository: productRepository) {}

  createProduct(product: CreateProductInput): Promise<Product> {
    return this.productRepository.save(product);
  }

  find(options?: FindManyOptions<Product>): Promise<Product[]> {
    return this.productRepository.find(options);
  }

  findOne(options: FindOneOptions<Product>): Promise<Product | null> {
    return this.productRepository.findOne(options);
  }

  async listProducts(): Promise<[Product[], number]> {
    // const result = await this.productRepository.findAndCount({
    const [products, count] = await this.productRepository.findAndCount({
      order: {
        created_at: 'asc',
      },
    });

    // Temporary
    return [products.map((product) => this.addErrorsToProduct(product)), count];
    // return result;
  }

  async getProduct(id: string): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.addErrorsToProduct(product);
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

    const isEmpty = Object.keys(input).length === 1;

    if (isEmpty) {
      throw new BadRequestException('No fields provided for update');
    }

    Object.assign(product, input);
    const savedProduct = await this.productRepository.save(product);

    return savedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  // Temporary
  private addErrorsToProduct(product: Product) {
    const errors: string[] = [];

    const p: any = product;

    if (p.price == '0') {
      errors.push('Price is set to 0');
    }

    p.errors = errors;
    return p;
  }
}
