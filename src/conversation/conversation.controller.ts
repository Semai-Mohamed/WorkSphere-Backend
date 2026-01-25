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
    await this.conversationService.openConversation(
      offerId,
      clientId,
      freelancerId,
    );
    return 'Conversation open with successfully'
  }

  @Get('messages/:id')
  async getMessages(
    @Param('id') conversationId: number,
    @GetUserId() userId: number,
  ) {
    return this.conversationService.getMessageByConversation(
      conversationId,
      userId,
    );
  }

  @Get('')
  async getUserConversations(@GetUserId() userId: number) {
    return this.conversationService.getUserConversations(userId);
  }

  @Get('messages')
  async getAllUserMessages(@GetUserId() userId: number) {
    return this.conversationService.getAllMessages(userId);
  }
}
 
  