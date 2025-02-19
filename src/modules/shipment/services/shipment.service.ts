import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  CreateShipmentInput,
  UpdateShipmentInput,
} from '../dto/shipment-input';
import { Shipment } from '../entities/shipment.entity';
import { ShipmentRepository } from '../repositories/shipment.repository';

@Injectable()
export class ShipmentService {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  createShipment(shipment: CreateShipmentInput): Promise<Shipment> {
    return this.shipmentRepository.save(shipment);
  }

  find(options?: FindManyOptions<Shipment>): Promise<Shipment[]> {
    return this.shipmentRepository.find(options);
  }

  findOne(options: FindOneOptions<Shipment>): Promise<Shipment | null> {
    return this.shipmentRepository.findOne(options);
  }

  listShipments(): Promise<[Shipment[], number]> {
    return this.shipmentRepository.findAndCount({
      relations: {
        customer: true,
        shipments: true,
      },
    });
  }

  async getShipment(id: string): Promise<Shipment | null> {
    const shipment = await this.shipmentRepository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        shipments: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async updateShipment(input: UpdateShipmentInput): Promise<Shipment | null> {
    const { id } = input;

    if (!id) {
      throw new BadRequestException('Shipment id is required');
    }

    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const isEmpty = Object.keys(input).length === 1;

    if (isEmpty) {
      return this.shipmentRepository.findOne({ where: { id } });
    }

    Object.assign(shipment, input);
    const savedShipment = await this.shipmentRepository.save(shipment);

    return savedShipment;
  }

  async deleteShipment(id: string): Promise<void> {
    await this.shipmentRepository.delete(id);
  }
}
