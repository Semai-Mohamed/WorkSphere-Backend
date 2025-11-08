import { Request } from 'express';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface RequestWithUser extends Request {
  user: any;
}
export class EmailCheckDto {
  @ApiProperty({example : 'm_semai@estin.dz'})
  @IsEmail()
  email: string;
}
export class PasswordCheckDto {
  @ApiProperty({example : 'Semai8_'})
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
