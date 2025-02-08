import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateProductInput } from '../../dto/product-input.dto';
import { IProduct } from '../../interfaces/product.interface';

@Injectable()
export class ProductExistsPipe implements PipeTransform {
  constructor(@Inject(IProduct) private readonly productService: IProduct) {}

  async transform(product: CreateProductInput, metadata: ArgumentMetadata) {
    if (!product.name) return product;

    const isProductExist = await this.productService.findOne({
      where: { name: product.name },
    });

    if (isProductExist) {
      throw new BadRequestException(
        `Product with name ${product.name} already exists`,
      );
    }

    return product;
  }
}
