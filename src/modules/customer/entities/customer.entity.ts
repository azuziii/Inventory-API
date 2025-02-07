import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: false, unique: true })
  ice!: string;

  @Column({ type: 'text', default: '', nullable: false })
  address!: string;

  @Column({ type: 'text', default: '', nullable: false })
  city!: string;
}
