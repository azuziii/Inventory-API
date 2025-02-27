import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogController } from './controllers/activity_log.controller';
import { ActivityLog } from './entities/activity_log.entity';
import { IActivityLog } from './interface/activity-log.interface';
import { ActivityLogService } from './services/activity_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogController],
  providers: [
    ActivityLogService,
    {
      provide: IActivityLog,
      useExisting: ActivityLogService,
    },
  ],
  exports: [IActivityLog],
})
export class ActivityLogModule {}
