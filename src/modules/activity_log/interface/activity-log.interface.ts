import { ActivityLogInput } from '../dto/activity-log-input.dto';
import { ActivityLog } from '../entities/activity_log.entity';

export const IActivityLog = 'IActivityLog';

export interface IActivityLog {
  log(input: ActivityLogInput): Promise<ActivityLog>;
}
