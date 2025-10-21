import { IsNotEmpty, IsString, IsArray, } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  id : string

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  link?: string;

  
  @IsString()
  photo?: string;

  @IsArray()
  @IsString({ each: true })
  category: string[];

  
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  
}
