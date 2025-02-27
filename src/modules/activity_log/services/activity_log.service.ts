import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogInput } from '../dto/activity-log-input.dto';
import { ActivityLog } from '../entities/activity_log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  log(input: ActivityLogInput): Promise<ActivityLog> {
    return this.activityLogRepository.save(input);
  }

  getLogs(id: string) {
    return this.activityLogRepository.find({ where: { entity_id: id } });
  }

  listLogs() {
    return this.activityLogRepository.find();
  }
}
