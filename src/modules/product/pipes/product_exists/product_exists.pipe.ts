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
  constructor(@Inject(IProduct) private readonly userService: IProduct) {}

  async transform(product: CreateProductInput, metadata: ArgumentMetadata) {
    const isProductExist = await this.userService.findOne({
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
