
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ConversationService } from './conversation.service';
import { Server, Socket } from 'node_modules/socket.io/dist';


@WebSocketGateway(80, { namespace: 'freelancer-client' })

// @UseGuards(AuthGuard) use one for websocket
export class ConversationGateway {
  
  constructor(private readonly conversationService : ConversationService){}

  @WebSocketServer() server : Server
  
  handleConnection(client : Socket){
    console.log(`Client connected : ${client.id}`)
  }

  hadnleDisconnect(client : Socket){
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('joinConversation')
  async onJoin(
    @MessageBody() conversationId: number,
    @ConnectedSocket() client : Socket
  ){
    await client.join(`conversation_${conversationId}`)
    console.log(`${client.id} joined room conversation ${conversationId}`)
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @MessageBody()
    { conversationId, senderId, content , participantId }: { conversationId: number;  content: string ; senderId: number ; participantId : number},
  ) {
    
    const message = await this.conversationService.createMessage(conversationId,  content , senderId, participantId);

    this.server.to(`conversation_${conversationId}`).emit('newMessage', message);
  }
}