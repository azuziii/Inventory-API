import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  CreateProductInput,
  UpdateProductInput,
} from './dto/product-input.dto';
import { ProductOutput } from './dto/product-output.dto';
import { ProductExistsPipe } from './pipes/product_exists/product_exists.pipe';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(ProductExistsPipe)
  createProduct(@Body() input: CreateProductInput) {
    return this.productService.createProduct(input);
  }

  @Get()
  listProducts(): Promise<ProductOutput[]> {
    return this.productService.listProducts();
  }

  @Get(':id')
  getProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductOutput | null> {
    return this.productService.getProduct(id);
  }

  @Patch(':id')
  updateProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateProductInput,
  ) {
    return this.productService.updateProduct({ ...input, id });
  }

  @Patch()
  updateProductByBody(@Body() input: UpdateProductInput) {
    return this.productService.updateProduct(input);
  }
}
