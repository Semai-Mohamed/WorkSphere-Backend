import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from 'node_modules/@nestjs/common';
import { Server, Socket } from 'node_modules/socket.io/dist';
import { WsAuthGuard } from 'src/conversation/ws.auth.guard ';

@UseGuards(WsAuthGuard)
@WebSocketGateway(80,{namespace :'notification'})
export class NotificationGateway {
  
  @WebSocketServer() server : Server

  handleConnection(client : Socket){
    console.log(`Client connected ${client.id}`)
  }

  hadnleDisconnect(client : Socket){
    console.log(`Client disconnect ${client.id}`)
  }
  
  @SubscribeMessage('joinRoom')
  async onJoin(@ConnectedSocket() client : Socket,@MessageBody() userId : number){
    await client.join(`notification_${userId}`)
  }

  sendNotification(userId :number , payload : any){
   this.server.to(`user_${userId}`).emit('notification',payload)
  }
   
  sendGlobalNotification(payload: any) {
    this.server.emit('notification', payload);
  }
}
