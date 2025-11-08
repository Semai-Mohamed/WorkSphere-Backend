import { IsNotEmpty, IsString, IsArray } from 'class-validator';
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
  @IsString()
  service: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required' })
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
