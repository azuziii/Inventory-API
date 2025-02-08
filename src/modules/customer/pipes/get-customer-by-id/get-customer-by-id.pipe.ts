import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ICustomer } from '../../interfaces/customer.interface';

@Injectable()
export class GetCustomerByIdPipe implements PipeTransform {
  constructor(@Inject(ICustomer) private readonly customerService: ICustomer) {}

  async transform(input: any, metadata: ArgumentMetadata) {
    if (!input || !input.customer) return input;

    if (!isUUID(input.customer)) {
      throw new BadRequestException('Invalid customer id');
    }

    const isCustomerExist = await this.customerService.findOne({
      where: { id: input.customer },
    });

    if (!isCustomerExist) {
      throw new NotFoundException(`Customer not found`);
    }

    return {
      ...input,
      customer: isCustomerExist,
    };
  }
}
