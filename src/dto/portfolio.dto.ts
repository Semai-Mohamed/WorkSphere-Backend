import { IsOptional, IsString, IsUrl } from 'class-validator';
import { PartialType, PickType } from 'node_modules/@nestjs/swagger';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist';

export class CreatePortfolioDto {
  @ApiProperty()
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({}, { message: 'portfolioLink must be a valid URL' })
  portfolioLink?: string;
}
export class UpdatePortfolio extends PartialType(
  PickType(CreatePortfolioDto, [
  'mobile',
  'description',
  'portfolioLink',
  'location',
] as const)
) {}
