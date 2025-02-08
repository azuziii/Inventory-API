import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { IProduct } from '../../interfaces/product.interface';

@Injectable()
export class GetProductByIdPipe implements PipeTransform {
  constructor(@Inject(IProduct) private readonly productService: IProduct) {}

  async transform(input: any, metadata: ArgumentMetadata) {
    if (!input || !input.product) return input;

    if (!isUUID(input.product)) {
      throw new BadRequestException('Invalid product id');
    }

    const isProductExist = await this.productService.findOne({
      where: { id: input.product },
    });

    if (!isProductExist) {
      throw new NotFoundException(`Product not found`);
    }

    return {
      ...input,
      product: isProductExist,
    };
  }
}
