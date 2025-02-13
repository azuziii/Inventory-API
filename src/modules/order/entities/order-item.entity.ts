import { Product } from 'src/modules/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order-item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @Column({ type: 'boolean', default: false })
  // isDone!: boolean;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn()
  product!: Product;

  @ManyToOne(() => Order, (order) => order.orders)
  order!: Order;
}
