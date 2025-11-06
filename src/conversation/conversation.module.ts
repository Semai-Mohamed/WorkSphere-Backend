import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway],
})
export class ConversationModule {}
