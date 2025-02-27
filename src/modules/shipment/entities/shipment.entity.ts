import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { carEnum, DestinationEnum } from '../enum/shipment.enum';
import { ShipmentItem } from './shipment-item.entity';

@Entity('shipment')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', nullable: false, default: () => 'NOW()' })
  date!: Date;

  @Column({ nullable: false, default: 0 })
  bon!: number;

  @Column({ default: 1 })
  travels!: number;

  @Column({ enum: carEnum })
  type!: carEnum;

  @Column({ enum: DestinationEnum, default: DestinationEnum.ALLER })
  destination!: DestinationEnum;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn()
  customer!: Customer;

  @OneToMany(() => ShipmentItem, (item) => item.shipment)
  shipments!: ShipmentItem[];
}
