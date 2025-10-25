import { IsNotEmpty, IsString, IsArray, } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
export class CreateProjectDto {
  
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
export class UpdateProjectDto extends PickType(CreateProjectDto, [
  "title",
  "description",
  "link",
  "photo",
  "category",
  "technologies",
] as const) {}
