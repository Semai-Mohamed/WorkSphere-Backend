import { Body, Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto, UpdatePortfolio } from 'src/dto/portfolio.dto';
import { GetUserId } from 'src/common/user.decorator';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { Portfolio } from './portfolio.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFilePipe } from 'src/pipes/image.file.pipe';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly porfolioService : PortfolioService){}

  @UseInterceptors(FileInterceptor('photo'))
  @CheckPolicies('create', Portfolio)
  @Post('create')
  create(@Body() createPortfolioDto : CreatePortfolioDto,@GetUserId() userId : number,@UploadedFile(ImageFilePipe) file? : Express.Multer.File){
   return this.porfolioService.createPortfolio(createPortfolioDto,userId,file)
  }

  @CheckPolicies('read', Portfolio)
  @Get(":id")
  get(@Param("id") userId : number){
    return this.porfolioService.getUserPortfolio(userId)
  }
  
  @UseInterceptors(FileInterceptor('photo'))
  @CheckPolicies('update', Portfolio)
  @Patch(":id")
  update(@Body() dto : UpdatePortfolio,@Param("id") userId : number,@UploadedFile(ImageFilePipe) file? : Express.Multer.File){
    return this.porfolioService.updateUserPortfolio(userId,dto,file)
  }
  
}
