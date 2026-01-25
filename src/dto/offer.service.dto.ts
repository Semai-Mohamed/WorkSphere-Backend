import { IsNotEmpty, IsString, IsArray,  MinLength,  MaxLength } from 'class-validator';
import { PartialType, PickType } from 'node_modules/@nestjs/swagger';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist';

export enum Status {
  FINISHED = 'finished',
  NOTFINISHED = 'notfinished',
  NOTAPPROVED = 'not approved',
}
export class CreateOffreDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Service name is required' })
  @MinLength(3, { message: 'Service name must be at least 3 characters' })
  @MaxLength(255, { message: 'Service name must be at most 255 characters' })
  @IsString()
  service: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  @MaxLength(1000, { message: 'Description must be at most 1000 characters' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Price is required' })
  @IsString()
  price: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  category: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}

export class UpdateOffreDto extends PartialType(
  PickType(CreateOffreDto, [
    'service',
    'description',
    'price',
    'category',
    'technologies',
  ] as const),
) {}
