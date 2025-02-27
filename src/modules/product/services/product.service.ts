import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType } from 'src/modules/activity_log/enum/activity-types.enum';
import { IActivityLog } from 'src/modules/activity_log/interface/activity-log.interface';
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
  constructor(
    private readonly productRepository: productRepository,
    @Inject(IActivityLog) private readonly activityLogService: IActivityLog,
  ) {}

  async createProduct(product: CreateProductInput): Promise<Product> {
    const savedProduct = await this.productRepository.save(product);

    await this.activityLogService.log({
      entity_id: savedProduct.id,
      new_data: JSON.stringify(savedProduct),
      table_name: this.productRepository.metadata.name,
      type: ActivityType.Created,
    });

    return savedProduct;
  }

  bulkCreate(products: CreateProductInput[]) {
    return Promise.all(
      products.map((p) => {
        this.productRepository.save(p);
      }),
    );
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

    const savedProduct = await this.productRepository.save({
      ...product,
      ...input,
    });

    await this.activityLogService.log({
      entity_id: savedProduct.id,
      old_data: JSON.stringify(product),
      new_data: JSON.stringify(savedProduct),
      table_name: this.productRepository.metadata.name,
      type: ActivityType.Updated,
    });

    return savedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    await this.activityLogService.log({
      entity_id: id,
      old_data: JSON.stringify(product || {}),
      table_name: this.productRepository.metadata.name,
      type: ActivityType.Deleted,
    });

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
