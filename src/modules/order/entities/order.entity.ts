import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', nullable: false, default: () => 'NOW()' })
  date!: Date;

  @Column({ type: 'text', unique: true, nullable: false })
  cdn!: string;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn()
  customer!: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orders!: OrderItem[];
}
