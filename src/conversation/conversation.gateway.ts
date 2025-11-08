/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConversationService } from './conversation.service';
import { Server, Socket } from 'node_modules/socket.io/dist';
import { UseGuards } from 'node_modules/@nestjs/common';
import { WsAuthGuard } from './ws.auth.guard ';
import { AsyncApiPub } from 'node_modules/nestjs-asyncapi/dist/lib';
import { JoinConversationDto, SendMessageDto } from 'src/dto/conversation.dto';

@WebSocketGateway(80, { namespace: 'freelancer-client' })
@UseGuards(WsAuthGuard)
export class ConversationGateway {
  constructor(private readonly conversationService: ConversationService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected : ${client.id}`);
  }

  hadnleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @AsyncApiPub({
    channel: 'joinConversation',
    message: { payload: JoinConversationDto },
    operationId: 'joinConversation',
  })
  @SubscribeMessage('joinConversation')
  async onJoin(
    @MessageBody() body: JoinConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = body;
    await client.join(`conversation_${conversationId}`);
    console.log(`${client.id} joined room conversation ${conversationId}`);
  }

  @AsyncApiPub({
    channel: 'sendConversation',
    message: { payload: SendMessageDto },
    operationId: 'sendConversation',
  })
  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @MessageBody()
    body: SendMessageDto,
  ) {
    try {
      const { conversationId, senderId, content, participantId } = body;
      const message = await this.conversationService.createMessage(
        conversationId,
        { content },
        senderId,
        participantId,
      );
      this.server
        .to(`conversation_${conversationId}`)
        .emit('newMessage', message);
      return { success: true, message };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
