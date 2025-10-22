/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// auth/auth.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Redis } from 'ioredis';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const token = randomBytes(32).toString('hex');

    await this.redisClient.set(`reset:${user.id}`, token, 'EX', 900);

    console.log(`Reset link: http://localhost:3000/auth/reset-password?token=${token}&id=${user.id}`);

    return { message: 'Reset link sent to email' };
  }

  async resetPassword(userId: number, token: string, newPassword: string) {
    const storedToken = await this.redisClient.get(`reset:${userId}`);
    if (!storedToken || storedToken !== token) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    // Remove token
    await this.redisClient.del(`reset:${userId}`);

    return { message: 'Password reset successfully' };
  }
}
