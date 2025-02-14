import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateOrderInput, UpdateOrderInput } from '../../dto/order-input.dto';
import { IOrder } from '../../interfaces/order.interface';

@Injectable()
export class OrderCdnExistsPipe implements PipeTransform {
  constructor(@Inject(IOrder) private readonly orderService: IOrder) {}

  async transform(
    input: CreateOrderInput | UpdateOrderInput,
    metadata: ArgumentMetadata,
  ) {
    if (!input.cdn) return input;

    let order = null;

    const isOrderCdnExist = await this.orderService.findOne({
      where: { cdn: input.cdn },
    });

    if (
      input instanceof UpdateOrderInput &&
      isOrderCdnExist &&
      isOrderCdnExist.id == input.id
    ) {
      return input;
    }

    if (isOrderCdnExist) {
      throw new BadRequestException(
        `Order with cdn '${input.cdn}' already exists`,
      );
    }

    return input;
  }
}
