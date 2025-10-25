import { IsNotEmpty, IsString,  IsBoolean, IsNumber} from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  id :number

  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  message: string;

  @IsNotEmpty({ message: 'checked is required' })
  @IsBoolean()
  checked: boolean;

  @IsNotEmpty({ message: 'userId cannot be empty' })
  @IsNumber()
  userId: number;

  @IsNotEmpty({ message: 'purpose cannot be empty' })
  @IsString()
  purpose: string;

  
}
