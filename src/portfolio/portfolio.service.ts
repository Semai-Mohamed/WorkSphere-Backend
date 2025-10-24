/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { Repository } from 'node_modules/typeorm';
import { CreatePortfolioDto } from 'src/dto/portfolio.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class PortfolioService {
    constructor(
        @InjectRepository(Portfolio)
        private readonly portfolioRepository :Repository<Portfolio>,

        @InjectRepository(User)
        private readonly userRepository : Repository<User>
    ){}
    async createPortfolio(createPortfolioDto : CreatePortfolioDto,userId : any):Promise<Portfolio>{
        const user = await this.userRepository.findOne({where : {id : userId}})
        if(!user){
            throw new NotFoundException('User not found')
        }
        if(user.portfolio){
            throw new BadGatewayException('User already has a portfolio')
        }
        const portfolio = this.portfolioRepository.create({
            ...createPortfolioDto,
            user,
        })
        return await this.portfolioRepository.save(portfolio)
    }

    async getUserPortfolio(userId : any){
       const portfolio = await this.portfolioRepository.findOne({
        where : {user : {id : userId}},
        relations : ['user'],
       })
       if(!portfolio) throw new NotFoundException('Porfolio not found')
        return portfolio
    }

    async updateUserPortfolio(userId : any, dto : CreatePortfolioDto){
        const portfolio = await this.getUserPortfolio(userId)
        const updatedPortfolio = await this.portfolioRepository.preload({
            id : portfolio.id,
            ...dto
        })
        if(!updatedPortfolio){
            throw new BadGatewayException("cannot update your portfolio")
        }
        return await this.portfolioRepository.save(updatedPortfolio)
    }
    
}
