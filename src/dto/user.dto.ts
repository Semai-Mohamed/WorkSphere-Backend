import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsEnum,
  Matches,
  IsString,
} from 'class-validator';
import { PartialType, PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  FREELANCER = 'freelancer',
}
export class CreateUserDto {
  @IsOptional()
  id: number;

  @ApiProperty({ example: 'Mohammed' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Semai' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'm_semai@estin.dz' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({ example: 'Semai8_' })
  @IsOptional()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  password?: string;

  @IsOptional()
  isEmailConfirmed?: boolean;

  @ApiProperty({ example: 'client' })
  @IsEnum([UserRole.CLIENT, UserRole.FREELANCER], {
    message: 'Role must be one of the allowed values',
  })
  role?: UserRole;
}

export class LoginUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({ example: 'Semai8_' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  password: string;
}
export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['firstName', 'lastName'] as const),
) {}
