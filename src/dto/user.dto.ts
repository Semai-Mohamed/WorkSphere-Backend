/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsEnum, Matches,  } from 'class-validator';
import { UserRole } from '../user/user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' } )
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  mobile: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  password: string;

  @IsOptional()
  googleId?: string;

  @IsEnum([UserRole.CLIENT, UserRole.FREELANCER], { message: 'Role must be one of the allowed values' })
  role?: UserRole;

  @IsOptional()
  photo?: string;

  @IsOptional()
  description?: string;
}

export class LoginUserDto {
    @IsEmail({}, { message: 'Email must be valid' })
    email : string

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/(?=.*[0-9])/, { message: 'Password must contain at least one number' })
    password: string;

}