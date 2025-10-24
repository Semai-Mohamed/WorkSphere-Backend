import { IsNotEmpty, IsString, IsNumber, IsArray, IsEnum} from 'class-validator';
export enum Type {
  FREELANCE_OFFER = 'freelanceOffre',
  CLIENT_OFFER= 'clientOffre',
}
export enum Status {
  FINISHED = "finished",
  NOTFINISHED = "notfinished",
  NOTAPPROVED = "not approved"
  
}
export class CreateOffreDto {
  @IsNotEmpty()
  @IsNumber()
  id : number

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

  @IsEnum(Status)
  status: Status;

  
}
