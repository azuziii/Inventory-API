import { ActivityType } from '../enum/activity-types.enum';

export class ActivityLogInput {
  entity_id!: string;
  table_name!: string;
  type!: ActivityType;
  old_data?: string;
  new_data?: string;
}
