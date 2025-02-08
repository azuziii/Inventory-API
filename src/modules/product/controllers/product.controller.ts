import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import {
  CreateProductInput,
  UpdateProductInput,
} from '../dto/product-input.dto';
import { ProductOutput } from '../dto/product-output.dto';
import { ProductExistsPipe } from '../pipes/product_exists/product_exists.pipe';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body(ProductExistsPipe) input: CreateProductInput,
  ): Promise<ApiResponse<ProductOutput>> {
    const product = await this.productService.createProduct(input);

    return {
      data: plainToInstance(ProductOutput, product, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Get()
  async listProducts(): Promise<ApiResponse<ProductOutput[]>> {
    const [products, count] = await this.productService.listProducts();

    return {
      data: plainToInstance(ProductOutput, products, {
        excludeExtraneousValues: true,
      }),
      meta: { count },
    };
  }

  @Get(':id')
  async getProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<ProductOutput | null>> {
    const product = await this.productService.getProduct(id);

    return {
      data: plainToInstance(ProductOutput, product, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch(':id')
  async updateProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ProductExistsPipe) input: UpdateProductInput,
  ): Promise<ApiResponse<ProductOutput>> {
    const product = await this.productService.updateProduct({ ...input, id });

    return {
      data: plainToInstance(ProductOutput, product, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Patch()
  async updateProductByBody(
    @Body(ProductExistsPipe) input: UpdateProductInput,
  ): Promise<ApiResponse<ProductOutput>> {
    const product = await this.productService.updateProduct(input);

    return {
      data: plainToInstance(ProductOutput, product, {
        excludeExtraneousValues: true,
      }),
      meta: {},
    };
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
