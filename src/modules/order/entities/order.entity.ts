import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', nullable: false, default: () => 'NOW()' })
  date!: Date;

  @Column({ type: 'text', unique: true, nullable: false })
  cdn!: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer!: Customer;
}
