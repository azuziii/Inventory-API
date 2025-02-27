import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityType } from 'src/modules/activity_log/enum/activity-types.enum';
import { IActivityLog } from 'src/modules/activity_log/interface/activity-log.interface';
import { ICustomer } from 'src/modules/customer/interfaces/customer.interface';
import { IOrderItem } from 'src/modules/order/interfaces/order-item.interface';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import {
  CreateShipmentInput,
  CreateShipmentInputBulk,
  GetCdnInput,
  UpdateShipmentInput,
} from '../dto/shipment-input';
import { Shipment } from '../entities/shipment.entity';
import { IShipmentItem } from '../interfaces/shipment-item.interface';
import { IShipment } from '../interfaces/shipment.interface';

@Injectable()
export class ShipmentService implements IShipment {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @Inject(IShipmentItem) private readonly shipmentItemService: IShipmentItem,
    @Inject(IOrderItem) private readonly orderItemService: IOrderItem,
    @Inject(ICustomer) private readonly customerService: ICustomer,
    @Inject(IActivityLog) private readonly activityLogService: IActivityLog,
  ) {}

  async createShipment(shipment: CreateShipmentInput): Promise<Shipment> {
    const savedShipment = await this.shipmentRepository.save(shipment);

    await this.activityLogService.log({
      entity_id: savedShipment.id,
      new_data: JSON.stringify(savedShipment),
      table_name: this.shipmentRepository.metadata.name,
      type: ActivityType.Created,
    });

    return savedShipment;
  }

  async bulkCreate(shipments: CreateShipmentInputBulk[]) {
    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]!;
      const customer = await this.customerService.findOne({
        where: { name: shipment.customer },
      });

      const savedShipment = await this.shipmentRepository.save({
        ...{
          bon: shipment.bon,
          date: shipment.date,
          destination: shipment.destination,
          travels: shipment.travels,
          type: shipment.type,
        },
        customer,
      } as CreateShipmentInput);

      await this.shipmentItemService.createShipmentItemBulk(
        shipment.items.map((x) => ({ ...x, shipment: savedShipment })),
      );
    }
  }

  find(options?: FindManyOptions<Shipment>): Promise<Shipment[]> {
    return this.shipmentRepository.find(options);
  }

  findOne(options: FindOneOptions<Shipment>): Promise<Shipment | null> {
    return this.shipmentRepository.findOne(options);
  }

  listShipments(): Promise<[Shipment[], number]> {
    return this.shipmentRepository.findAndCount({
      order: {
        date: 'DESC',
        bon: 'DESC',
      },
      relations: {
        customer: true,
        shipments: {
          product: true,
        },
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

    const savedShipment = await this.shipmentRepository.save({
      ...shipment,
      ...input,
    });

    await this.activityLogService.log({
      entity_id: savedShipment.id,
      old_data: JSON.stringify(shipment),
      new_data: JSON.stringify(savedShipment),
      table_name: this.shipmentRepository.metadata.name,
      type: ActivityType.Updated,
    });

    return savedShipment;
  }

  async deleteShipment(id: string): Promise<void> {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    await this.activityLogService.log({
      entity_id: id,
      old_data: JSON.stringify(shipment || {}),
      table_name: this.shipmentRepository.metadata.name,
      type: ActivityType.Deleted,
    });

    await this.shipmentRepository.delete(id);
  }

  async getCdn({ quantity, product, customer }: GetCdnInput) {
    const orders = await this.orderItemService.find({
      relations: {
        order: true,
      },
      where: {
        product: {
          id: product,
        },
        order: {
          customer: {
            id: customer,
          },
        },
      },
      order: {
        order: {
          date: 'ASC',
        },
      },
    });
    let calculatedCdns = [];
    for (let order of orders) {
      if (order.quantity <= quantity) {
        calculatedCdns.push({
          cdn: order.order.cdn,
          quantity: order.quantity,
          product,
        });
        quantity -= order.quantity;
      } else if (order.quantity > quantity) {
        calculatedCdns.push({
          cdn: order.order.cdn,
          quantity: quantity,
          product,
        });
        quantity -= quantity;
      }
      if (quantity == 0) {
        break;
      }
    }
    if (!calculatedCdns.length) {
      throw new BadRequestException('Nothing to calculate');
    }
    return calculatedCdns;
  }
}
