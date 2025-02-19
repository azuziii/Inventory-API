import { Product } from 'src/modules/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity('shipment_item')
export class ShipmentItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn()
  product!: Product;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ type: 'text', default: '' })
  cdn!: string;

  @ManyToOne(() => Shipment, (item) => item.shipments)
  shipment!: Shipment;
}
