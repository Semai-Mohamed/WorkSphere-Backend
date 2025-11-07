import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { Conversation } from './entity/conversation.entity';
import { User } from 'src/user/user.entity';
import { Offre } from 'src/offer/offer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WsAuthGuard } from './ws.auth.guard ';

@Module({
  imports : [TypeOrmModule.forFeature([Message,Conversation,User,Offre]),AuthModule],
  providers: [ConversationService, ConversationGateway,WsAuthGuard],
})
export class ConversationModule {}
