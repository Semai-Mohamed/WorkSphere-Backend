import { ApiProperty } from "node_modules/@nestjs/swagger/dist";

export class JoinConversationDto {
  @ApiProperty()
  conversationId: number;
}

export class SendMessageDto {
  @ApiProperty()
  conversationId: number;
  @ApiProperty()
  senderId: number;
  @ApiProperty()
  participantId: number;
  @ApiProperty()
  content: string;
}
