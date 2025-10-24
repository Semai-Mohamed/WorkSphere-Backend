import { IsOptional, IsString, IsUrl } from 'class-validator';
import { PickType } from 'node_modules/@nestjs/mapped-types';

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
export class UpdatePortfolio extends PickType(CreatePortfolioDto, ["mobile","photo","description","portfolioLink","location"] as const) {}

