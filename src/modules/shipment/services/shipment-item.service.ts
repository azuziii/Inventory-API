import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    return this.shipmentItemRepository.save(input);
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

  editShipmentItem(input: UpdateShipmentitemInput): Promise<ShipmentItem> {
    return this.shipmentItemRepository.save(input);
  }

  async deleteShipment(id: string): Promise<void> {
    await this.shipmentItemRepository.delete(id);
  }
}
