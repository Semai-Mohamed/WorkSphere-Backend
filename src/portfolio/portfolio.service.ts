/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { Repository } from 'node_modules/typeorm';
import { CreatePortfolioDto } from 'src/dto/portfolio.dto';
import { User } from 'src/user/user.entity';
import { CloudinaryStrategy } from 'src/common/strategies/cloudinary.strategy';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly cloudinaryStrategy: CloudinaryStrategy,
  ) {}
  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<Portfolio> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['portfolio'],
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.portfolio)
      throw new BadRequestException('User already has a portfolio');
    let photoUrl: string | undefined = undefined;
    if (file) {
      photoUrl = (await this.cloudinaryStrategy.uploadFile(
        file,
        'portfolios-photos',
      )) as string;
    }
    const portfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      user: { id: userId },
      photo: photoUrl,
    });
    return await this.portfolioRepository.save(portfolio);
  }

  async getUserPortfolio(userId: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!portfolio) throw new NotFoundException('Porfolio not found');
    return portfolio;
  }

  async updateUserPortfolio(
    userId: number,
    dto: any,
    file?: Express.Multer.File,
  ): Promise<Portfolio> {
    
    const portfolio = await this.getUserPortfolio(userId);
    let photoUrl: string | undefined = undefined;
    if (file) {
      photoUrl = (await this.cloudinaryStrategy.uploadFile(
        file,
        'portfolios-photos',
      )) as string;
    }
    const updatedPortfolio = await this.portfolioRepository.preload({
      ...dto,
      id: portfolio.id,
      photo: photoUrl ?? portfolio.photo,
    });
    if (!updatedPortfolio) {
      throw new BadRequestException('cannot update your portfolio');
    }
    return await this.portfolioRepository.save(updatedPortfolio);
  }
}
