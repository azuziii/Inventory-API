import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../../dto/customer-input.dto';
import { ICustomer } from '../../interfaces/customer.interface';

@Injectable()
export class CustomerIceExistsPipe implements PipeTransform {
  constructor(@Inject(ICustomer) private readonly customerService: ICustomer) {}

  async transform(
    customer: CreateCustomerInput | UpdateCustomerInput,
    metadata: ArgumentMetadata,
  ) {
    if (!customer.ice) return customer;

    const isCustomerExist = await this.customerService.findOne({
      where: { ice: customer.ice },
    });

    if (
      customer instanceof UpdateCustomerInput &&
      isCustomerExist &&
      isCustomerExist.id == customer.id
    ) {
      return customer;
    }

    if (isCustomerExist) {
      throw new BadRequestException(
        `Customer with ice '${customer.ice}' already exists`,
      );
    }

    return customer;
  }
}
