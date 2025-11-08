import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/user/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [TypeOrmModule.forFeature([Notification,User]),AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports : [NotificationService,NotificationGateway]
})
export class NotificationModule {}
