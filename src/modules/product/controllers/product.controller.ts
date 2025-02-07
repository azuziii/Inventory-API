import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
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
  @UsePipes(ProductExistsPipe)
  async createProduct(
    @Body() input: CreateProductInput,
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
    const list = await this.productService.listProducts();

    return {
      data: list,
      meta: {},
    };
  }

  @Get(':id')
  async getProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<ProductOutput | null>> {
    const product = await this.productService.getProduct(id);

    return {
      data: product,
      meta: {},
    };
  }

  @Patch(':id')
  async updateProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateProductInput,
  ): Promise<ApiResponse<ProductOutput>> {
    const product = await this.productService.updateProduct({ ...input, id });

    return {
      data: product,
      meta: {},
    };
  }

  @Patch()
  async updateProductByBody(
    @Body() input: UpdateProductInput,
  ): Promise<ApiResponse<ProductOutput>> {
    const result = await this.productService.updateProduct(input);

    return {
      data: result,
      meta: {},
    };
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
