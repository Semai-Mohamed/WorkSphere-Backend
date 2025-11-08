import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'purpose cannot be empty' })
  @IsString()
  purpose: string;
}

export class CreateUserIdDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  userId: number;
}
