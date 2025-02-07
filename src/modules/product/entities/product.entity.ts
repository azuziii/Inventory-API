import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false, unique: true })
  name!: string;

  @Column({ type: 'float', nullable: false, default: '0' })
  price!: string;
}
