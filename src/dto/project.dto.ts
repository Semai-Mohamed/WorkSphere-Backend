import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { PartialType, PickType } from '@nestjs/swagger';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist';
export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  link?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  category: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}
export class UpdateProjectDto extends PartialType(
  PickType(CreateProjectDto, [
    'title',
    'description',
    'link',
    'category',
    'technologies',
  ] as const),
) {}
