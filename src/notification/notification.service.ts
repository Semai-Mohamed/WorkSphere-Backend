import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Repository } from 'node_modules/typeorm';
import { CreateNotificationDto } from 'src/dto/notification.dto';
import { User } from 'src/user/user.entity';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(dto: CreateNotificationDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Cannot find this user');
    const notification = this.notificationRepository.create({
      ...dto,
      user,
    });
    if (!notification)
      throw new BadRequestException('failed to create this notification');
    return await this.notificationRepository.save(notification);
  }
  async getAllNotifications(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: { user: { id: userId } },
    });
    if (!notifications)
      throw new NotFoundException('cannot find notifications with this userId');
    return notifications
  }
  async getUncheckedNotifications(userId : number){
    const notifications = await this.notificationRepository.find({where : {user : {id : userId},checked : false}})
    if(!notifications)
        throw new NotFoundException('there no unchecked notification with this userId')
    return notifications
  }

  async removeNotification(notificationId : number){
    const notification = await this.notificationRepository.findOne({where : {id : notificationId}})
    if(!notification) throw new NotFoundException('cannot find this notification')
    await this.notificationRepository.remove(notification)
  }
}
