import { Request } from 'express';
import { IsEmail, IsString, MinLength,  } from 'class-validator/types';

export interface RequestWithUser extends Request {
  user: any
}
export class EmailCheckDto {
  @IsEmail()
  email: string;
}
export class PasswordCheckDto {
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    newPassword: string;
}