import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { CreateProductInput } from './dto/product-input.dto';
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
}
