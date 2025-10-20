import { IsNotEmpty, IsString, IsNumber, IsArray, IsEnum } from 'class-validator';
export enum Type {
  FREELANCE_OFFER = 'freelanceOffre',
  CLIENT_OFFER= 'clientOffre',
}
export class CreateOffreDto {
  @IsNotEmpty()
  @IsNumber()
  id : number

  @IsNotEmpty({ message: 'Service is required' })
  @IsString()
  service: string;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString()
  description: string;

  @IsNotEmpty({message : 'Price cannot be empty'})
  @IsString()
  price: string;
  
  @IsNotEmpty({ message: 'Reserved is required' })
  @IsArray()
  enroledUsers: number[];

  @IsNotEmpty()
  @IsNumber()
  numEnrolled : number

  @IsNotEmpty()
  @IsNumber()
  FreelencerId : number

  @IsEnum(Type, { message: 'Type must be one of the allowed values' })
    role?: Type;
}

