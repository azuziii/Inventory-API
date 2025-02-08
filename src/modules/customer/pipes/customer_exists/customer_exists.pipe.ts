import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateCustomerInput } from '../../dto/customer-input.dto';
import { ICustomer } from '../../interfaces/customer.interface';

@Injectable()
export class CustomerExistsPipe implements PipeTransform {
  constructor(@Inject(ICustomer) private readonly customerService: ICustomer) {}

  async transform(customer: CreateCustomerInput, metadata: ArgumentMetadata) {
    if (!customer.name) return customer;

    const isCustomerExist = await this.customerService.findOne({
      where: { name: customer.name },
    });

    if (isCustomerExist) {
      throw new BadRequestException(
        `Customer with name '${customer.name}' already exists`,
      );
    }
  }
}
