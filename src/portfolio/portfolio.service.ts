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
    async createPortfolio(createPortfolioDto : CreatePortfolioDto):Promise<Portfolio>{
        const user = await this.userRepository.findOne({
            where : {id : createPortfolioDto.userId},
            relations : ['portfolio'],
        })
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
}
