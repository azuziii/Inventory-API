import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ActivityLogService } from '../services/activity_log.service';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get(':id')
  getLogs(@Param('id', ParseUUIDPipe) id: string) {
    return this.activityLogService.getLogs(id);
  }

  @Get()
  listLogs() {
    return this.activityLogService.listLogs();
  }
}
