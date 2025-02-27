import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityType } from 'src/modules/activity_log/enum/activity-types.enum';
import { IActivityLog } from 'src/modules/activity_log/interface/activity-log.interface';
import { IOrderItem } from 'src/modules/order/interfaces/order-item.interface';
import { IProduct } from 'src/modules/product/interfaces/product.interface';
import { FindManyOptions, Repository } from 'typeorm';
import {
  CreateShipmentItemInput,
  CreateShipmentItemInputBulk,
  UpdateShipmentitemInput,
} from '../dto/shipment-item-input';
import { ShipmentItem } from '../entities/shipment-item.entity';
import { IShipmentItem } from '../interfaces/shipment-item.interface';

@Injectable()
export class ShipmentItemService implements IShipmentItem {
  constructor(
    @InjectRepository(ShipmentItem)
    private readonly shipmentItemRepository: Repository<ShipmentItem>,
    @Inject(IOrderItem) private readonly IOrderItemIOrderItem: IOrderItem,
    @Inject(IProduct) private readonly productService: IProduct,
    @Inject(IActivityLog) private readonly activityLogService: IActivityLog,
  ) {}

  find(options?: FindManyOptions<ShipmentItem>): Promise<ShipmentItem[]> {
    return this.shipmentItemRepository.find(options);
  }

  async createShipmentItem(
    input: CreateShipmentItemInput,
  ): Promise<ShipmentItem> {
    if (input.cdn && input.quantity) {
      await this.IOrderItemIOrderItem.updateQuantity(
        input.cdn,
        input.product.id,
        -input.quantity,
      );
    }

    const savedItem = await this.shipmentItemRepository.save(input);

    await this.activityLogService.log({
      entity_id: savedItem.id,
      new_data: JSON.stringify(savedItem),
      table_name: this.shipmentItemRepository.metadata.name,
      type: ActivityType.ItemCreated,
    });

    return savedItem;
  }

  async createShipmentItemBulk(
    input: CreateShipmentItemInputBulk[],
  ): Promise<void> {
    for (let item of input) {
      const product = await this.productService.findOne({
        where: { name: item.product },
      });

      if (item.cdn && item.quantity) {
        await this.IOrderItemIOrderItem.updateQuantity(
          item.cdn,
          item.product,
          -item.quantity,
        );
      }

      await this.shipmentItemRepository.save({
        ...item,
        product,
      } as CreateShipmentItemInput);
    }
  }

  async editShipmentItem(
    input: UpdateShipmentitemInput,
  ): Promise<ShipmentItem> {
    const shipmentItem = await this.shipmentItemRepository.findOne({
      where: { id: input.id! },
    });

    const savedItem = await this.shipmentItemRepository.save(input);

    await this.activityLogService.log({
      entity_id: savedItem.id,
      old_data: JSON.stringify(shipmentItem),
      new_data: JSON.stringify(savedItem),
      table_name: this.shipmentItemRepository.metadata.name,
      type: ActivityType.Updated,
    });

    return savedItem;
  }

  async deleteShipment(id: string): Promise<void> {
    const order = await this.shipmentItemRepository.findOne({ where: { id } });

    await this.activityLogService.log({
      entity_id: id,
      old_data: JSON.stringify(order || {}),
      table_name: this.shipmentItemRepository.metadata.name,
      type: ActivityType.Deleted,
    });

    await this.shipmentItemRepository.delete(id);
  }
}
