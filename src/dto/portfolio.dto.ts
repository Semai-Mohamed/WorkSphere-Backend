import { IsOptional, IsString, IsUrl, IsNumber } from 'class-validator';

export class CreatePortfolioDto {
  
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsString()
  description: string;

  
  @IsString()
  location: string;

  @IsOptional()
  @IsUrl({}, { message: 'portfolioLink must be a valid URL' })
  portfolioLink?: string;
}
