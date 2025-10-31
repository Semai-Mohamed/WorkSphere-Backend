import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import { PartialType, PickType } from 'node_modules/@nestjs/mapped-types';
export enum Type {
  FREELANCE_OFFER = 'freelanceOffre',
  CLIENT_OFFER = 'clientOffre',
}
export enum Status {
  FINISHED = 'finished',
  NOTFINISHED = 'notfinished',
  NOTAPPROVED = 'not approved',
}
export class CreateOffreDto {
  @IsNotEmpty({ message: 'Service name is required' })
  @IsString()
  service: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsString()
  price: string;

  @IsEnum(Type)
  type: Type;

  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  
}
 
export class UpdateOffreDto extends PartialType(
  PickType(CreateOffreDto, [
    'service',
    'description',
    'price',
    'type',
    'category',
    'technologies',
  ] as const),
) {}