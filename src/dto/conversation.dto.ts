import { IsNotEmpty, IsNumber} from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsNumber()
  id : number

  @IsNotEmpty()
  @IsNumber()
  creatorId: number;

  @IsNotEmpty()
  @IsNumber()
  participantId: number;
}
