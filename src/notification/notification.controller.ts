import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { GetUserId } from 'src/common/user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get('all/:userId')
  getAllNotifications(@GetUserId() userId: number) {
    return this.notificationService.getAllNotifications(userId);
  }

  @Get('unchecked/:userId')
  GetUnCheckedNotifications(@GetUserId() userId: number) {
    return this.notificationService.getUncheckedNotifications(userId);
  }

  @Delete(':id')
  async removeNotifications(
    @Param('id') notificationId: number,
    @GetUserId() userId: number,
  ) {
    await this.notificationService.removeNotification(notificationId, userId);
    return 'Notification removed with successfully'
  }
}
