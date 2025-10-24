import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, User])],
  controllers: [PortfolioController],
  providers: [PortfolioService]
  
})
export class PortfolioModule {}
