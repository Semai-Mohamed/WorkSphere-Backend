import { IsOptional, IsString, IsUrl } from 'class-validator';
import { PickType } from 'node_modules/@nestjs/mapped-types';

export class CreatePortfolioDto {
  @IsString()
  mobile: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsUrl({}, { message: 'portfolioLink must be a valid URL' })
  portfolioLink?: string;
}
export class UpdatePortfolio extends PickType(CreatePortfolioDto, [
  'mobile',
  'description',
  'portfolioLink',
  'location',
] as const) {}
