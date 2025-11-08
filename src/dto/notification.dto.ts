import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {

  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  message: string;

  @IsNotEmpty({ message: 'purpose cannot be empty' })
  @IsString()
  purpose: string;
}
