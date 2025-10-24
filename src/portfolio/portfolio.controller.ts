import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto, UpdatePortfolio } from 'src/dto/portfolio.dto';
import { GetUserId } from 'src/common/user.decorator';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { WorkSpherPolicyHandler } from 'src/casl/policy/policy.handler';
import { Portfolio } from './portfolio.entity';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly porfolioService : PortfolioService){}

  @CheckPolicies(new WorkSpherPolicyHandler('create',Portfolio))
  @Post('create')
  create(@Body() createPortfolioDto : CreatePortfolioDto,@GetUserId() userId : number){
   return this.porfolioService.createPortfolio(createPortfolioDto,userId)
  }

  @CheckPolicies(new WorkSpherPolicyHandler('read', Portfolio))
  @Get("")
  get(@GetUserId() userId : number){
    return this.porfolioService.getUserPortfolio(userId)
  }

  @CheckPolicies(new WorkSpherPolicyHandler('update',Portfolio))
  @Patch("update")
  update(@Body() dto : UpdatePortfolio,@GetUserId() userId : number){
    return this.porfolioService.updateUserPortfolio(userId,dto)
  }
  
}
