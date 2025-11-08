import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { forwardRef, Inject, UseGuards } from 'node_modules/@nestjs/common';
import { Server, Socket } from 'node_modules/socket.io/dist';
import { WsAuthGuard } from 'src/conversation/ws.auth.guard ';
import { NotificationService } from './notification.service';
import { AsyncApiPub } from 'nestjs-asyncapi';
import { CreateNotificationDto, CreateUserIdDto } from 'src/dto/notification.dto';

@UseGuards(WsAuthGuard)
@WebSocketGateway(60,{namespace :'notification'})
export class NotificationGateway {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService : NotificationService
  ){}
  @WebSocketServer() server : Server

  handleConnection(client : Socket){
    console.log(`Client connected ${client.id}`)
  }

  hadnleDisconnect(client : Socket){
    console.log(`Client disconnect ${client.id}`)
  }
  
  @AsyncApiPub({
  channel: 'joinNotificationRoom', // URI template
  operationId: 'joinNotificationRoom',
  message: {
    payload: CreateUserIdDto, 
  },
})
  @SubscribeMessage('joinRoom')
  async onJoin(@ConnectedSocket() client : Socket,@MessageBody() {userId} : CreateUserIdDto){
    await client.join(`notification_${userId}`)
  }

  @SubscribeMessage('markAsChecked')
  handleMarkAsChecked(@MessageBody() {userId ,notificationId } : {userId : number,notificationId : number} ){
   return this.notificationService.markAsChecked(notificationId,userId)
  }

  @AsyncApiPub({
    channel: 'sendNotification',
    message: { payload: CreateNotificationDto },
    operationId : 'sendNotification'
  })
  sendNotification(userId :number , notification : any){
   this.server.to(`user_${userId}`).emit('notification',notification)
  }
   
  sendGlobalNotification(payload: any) {
    this.server.emit('notification', payload);
  }
}
