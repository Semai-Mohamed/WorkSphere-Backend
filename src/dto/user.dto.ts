/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsEnum, Matches, IsNumber, IsString, ValidateIf,  } from 'class-validator';
import { OmitType, PickType } from '@nestjs/mapped-types';

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google'
}

export enum UserRole {
  ADMIN = 'admin',
  CLIENT= 'client',
  FREELANCER = 'freelancer',
}
export class CreateUserDto {
  
  id : number

  @IsNotEmpty({ message: 'First name is required' } )
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email:string 

  @IsOptional()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  password?: string;

  @IsOptional()
  isEmailConfirmed?: boolean;

  @IsEnum([UserRole.CLIENT, UserRole.FREELANCER], { message: 'Role must be one of the allowed values' })
  role?: UserRole;

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
export class UpdateUserDto extends PickType(CreateUserDto,['firstName','lastName',]as const){}