import { Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { Conversation } from './entity/conversation.entity';
import { GetUserId } from 'src/common/user.decorator';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post(':offerId/:freelancerId')
  @CheckPolicies('create', Conversation)
  async openConversation(
    @Param('offerId') offerId: number,
    @Param('freelancerId') freelancerId: number,
    @GetUserId() clientId: number,
  ) {
    return this.conversationService.openConversation(
      offerId,
      clientId,
      freelancerId,
    );
  }

  @Get(':id')
  async getMessages(
    @Param('id') conversationId: number,
    @GetUserId() userId: number,
  ) {
    return this.conversationService.getMessageByConversation(
      conversationId,
      userId,
    );
  }
}
