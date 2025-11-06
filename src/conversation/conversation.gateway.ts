/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { ConversationService } from './conversation.service';
import { Socket } from 'node_modules/socket.io/dist';

@WebSocketGateway(80, { namespace: 'freelancer-client' })

export class ConversationGateway {
  
  constructor(private readonly conversationService : ConversationService){}

  @WebSocketServer() server : Server
  
  handleConnection(client : Socket){
    console.log(`Client connected : ${client.id}`)
  }

  hadnleDisconnect(client : Socket){
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('message')
  async onJoin(
    @MessageBody() {conversationId} : {conversationId : number},
    @ConnectedSocket() client : Socket
  ){
    await client.join(`conversation ${conversationId}`)
    console.log(`${client.id} joined room conversation ${conversationId}`)
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @MessageBody()
    { conversationId, senderId, content }: { conversationId: number; senderId: number; content: string },
  ) {
    const message = await this.conversationService.saveMessage(conversationId, senderId, content);

    // Broadcast to all users in the same conversation
    this.server.to(`conversation_${conversationId}`).emit('newMessage', message);
  }
}