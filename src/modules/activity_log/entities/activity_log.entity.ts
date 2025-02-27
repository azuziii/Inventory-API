import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityType } from '../enum/activity-types.enum';

@Entity('activity_log')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: ActivityType, nullable: false })
  type!: ActivityType;

  @Column({ type: 'jsonb', default: null })
  old_data!: string;

  @Column({ type: 'jsonb' })
  new_data!: string;

  @Column({ type: 'text', nullable: false })
  table_name!: string;

  @Column({ type: 'text', nullable: false })
  entity_id!: string;

  @CreateDateColumn()
  created_at!: Date;
}
