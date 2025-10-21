import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  id : number

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  creatorId: number;

  @IsNotEmpty()
  @IsNumber()
  participantId: number;

  @IsNotEmpty()
  @IsNumber()
  conversationId: number;
}
