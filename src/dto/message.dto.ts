import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  content: string;
}
