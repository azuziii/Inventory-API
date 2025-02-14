import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  CreateProductInput,
  UpdateProductInput,
} from '../../dto/product-input.dto';
import { IProduct } from '../../interfaces/product.interface';

@Injectable()
export class ProductExistsPipe implements PipeTransform {
  constructor(@Inject(IProduct) private readonly productService: IProduct) {}

  async transform(
    product: CreateProductInput | UpdateProductInput,
    metadata: ArgumentMetadata,
  ) {
    if (!product.name) return product;

    const isProductExist = await this.productService.findOne({
      where: { name: product.name },
    });

    if (
      product instanceof UpdateProductInput &&
      isProductExist &&
      isProductExist.id == product.id
    ) {
      return product;
    }

    if (isProductExist) {
      throw new BadRequestException(
        `Product with name ${product.name} already exists`,
      );
    }

    return product;
  }
}
