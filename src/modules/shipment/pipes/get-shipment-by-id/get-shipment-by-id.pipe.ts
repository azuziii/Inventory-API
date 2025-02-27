import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { IShipment } from '../../interfaces/shipment.interface';

@Injectable()
export class GetShipmentByIdPipe implements PipeTransform {
  constructor(@Inject(IShipment) private readonly shipmentService: IShipment) {}

  async transform(input: any, metadata: ArgumentMetadata) {
    if (!input || !input.shipment) return input;

    if (!isUUID(input.shipment)) {
      throw new BadRequestException('Invalid shipment id');
    }

    const isShipmentExist = await this.shipmentService.findOne({
      where: { id: input.shipment },
    });

    if (!isShipmentExist) {
      throw new NotFoundException(`Shipment not found`);
    }

    return {
      ...input,
      shipment: isShipmentExist,
    };
  }
}
