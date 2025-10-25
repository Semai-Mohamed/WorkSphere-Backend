import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto, UpdatePortfolio } from 'src/dto/portfolio.dto';
import { GetUserId } from 'src/common/user.decorator';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { Portfolio } from './portfolio.entity';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly porfolioService : PortfolioService){}

  @CheckPolicies('create', Portfolio)
  @Post('create')
  create(@Body() createPortfolioDto : CreatePortfolioDto,@GetUserId() userId : number){
   return this.porfolioService.createPortfolio(createPortfolioDto,userId)
  }

  @CheckPolicies('read', Portfolio)
  @Get(":id")
  get(@Param("id") userId : number){
    return this.porfolioService.getUserPortfolio(userId)
  }

  @CheckPolicies('update', Portfolio)
  @Patch(":id")
  update(@Body() dto : UpdatePortfolio,@Param("id") userId : number){
    return this.porfolioService.updateUserPortfolio(userId,dto)
  }
  
}
