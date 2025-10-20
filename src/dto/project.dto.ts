import { IsNotEmpty, IsString, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  id : string

  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Reserved is required' })
  @IsArray()
  @IsString({ each: true }) 
  reserved: string[];

  @IsNotEmpty({ message: 'userId cannot be empty' })
  @IsNumber()
  userId: number;

  @IsNotEmpty({ message: 'reservedCount cannot be empty' })
  @IsNumber()
  reservedCount: number;

  @IsNotEmpty({ message: 'acceptedFreelancer cannot be empty' })
  @IsBoolean()
  acceptedFreelancer: boolean;
}
