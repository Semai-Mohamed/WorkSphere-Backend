import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { Conversation } from './entity/conversation.entity';
import { User } from 'src/user/user.entity';
import { Offre } from 'src/offer/offer.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Message,Conversation,User,Offre])],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway],
})
export class ConversationModule {}
