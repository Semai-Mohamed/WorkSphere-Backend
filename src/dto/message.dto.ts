import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  id : number

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'participant cannot be empty' })
  @IsString()
  sender: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
