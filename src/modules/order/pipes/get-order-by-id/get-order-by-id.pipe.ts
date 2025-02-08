import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { IOrder } from '../../interfaces/order.interface';

@Injectable()
export class GetOrderByIdPipe implements PipeTransform {
  constructor(@Inject(IOrder) private readonly orderService: IOrder) {}

  async transform(input: any, metadata: ArgumentMetadata) {
    if (!input || !input.order) return input;

    if (!isUUID(input.order)) {
      throw new BadRequestException('Invalid order id');
    }

    const isOrderExist = await this.orderService.findOne({
      where: { id: input.order },
    });

    if (!isOrderExist) {
      throw new NotFoundException(`Order not found`);
    }

    return {
      ...input,
      order: isOrderExist,
    };
  }
}
