import { IsOptional, IsString, IsUrl, IsNumber } from 'class-validator';

export class CreatePortfolioDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl({}, { message: 'portfolioLink must be a valid URL' })
  portfolioLink?: string;
}
