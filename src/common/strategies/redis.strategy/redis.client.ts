/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Redis } from 'ioredis';
import { User } from 'src/user/user.entity';
import { NodeMailderStrategy } from '../nodemailer.strategy';
import { EmailCheckDto, PasswordCheckDto } from 'src/dto/auth.dto';
import { JwtStrategy } from '../token.strategy/jwt.strategy';
import { ConfigService } from 'node_modules/@nestjs/config';

@Injectable()
export class RedisClient {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly nodeMailderStrategy: NodeMailderStrategy,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async requestPasswordReset({ email }: EmailCheckDto) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    console.log(`reset:${user.id}`);
    await this.redisClient.set(`reset:${user.id}`, token, 'EX', 900);
    const link = `${this.configService.get<string>('FrontendHost')}auth/reset-password?token=${token}&id=${user.id}`;
    await this.nodeMailderStrategy.sendResetEmail({ email }, link);
    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(userId: any, { newPassword }: PasswordCheckDto) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await this.userRepository.update(userId, {
      password: hashedPassword,
    });
    if (result.affected === 0) {
      throw new BadRequestException(
        'something get wrong ,cannot update the password ',
      );
    }
    return { message: 'Password reset successfully' };
  }

  async logout(token: string) {
    const decoded = await this.jwtStrategy.verifyJwt(token);
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    await this.redisClient.set(`revoked:${token}`, 'revoked', 'EX', ttl);
  }
}
