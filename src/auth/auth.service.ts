/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { User } from '../user/user.entity';
import { JwtStrategy } from '../common/strategies/token/jwt.strategy';
import { RedisClient } from '../common/strategies/redis/redis.client';
import {
  EmailCheckDto,
  PasswordCheckDto,
  RequestWithUser,
} from 'src/dto/auth.dto';
import Redis from 'node_modules/ioredis/built';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { CookiesStrategy } from '../common/strategies/token/cookies.strategy';
import { Response } from 'node_modules/@types/express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtStrategy: JwtStrategy,
    private redisClient: RedisClient,
    private cookiesStrategy: CookiesStrategy,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async signUP(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.signUp(createUserDto);
    if (!user) {
      throw new BadRequestException('User creation failed');
    }
    return user;
  }

  async signIn(
    loginUserDto: LoginUserDto,
    res: Response,
  ): Promise<{ message: string }> {
    const user = await this.userService.signIn(loginUserDto);
    if (!user) {
      throw new BadRequestException('User login failed');
    }
    const { password: _, ...payload } = user;
    const accessToken = await this.jwtStrategy.generateJwt(payload);
    const refreshToken = randomBytes(64).toString('hex');
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.redis.set(
      `refresh:${user.id}`,
      hashedToken,
      'EX',
      7 * 24 * 60 * 60,
    );

    this.cookiesStrategy.setAccessToken(res, accessToken);

    this.cookiesStrategy.setRefreshToken(res, refreshToken);
    return { message: 'Login successful' };
  }

  async googleSignIn(
    res: Response,
    user: any,
  ) {
    if (!user) {
      throw new BadRequestException('No user from google');
    }

    const { password: _, ...payload } = user;
    const jwt = await this.jwtStrategy.generateJwt(payload);
    this.cookiesStrategy.setAccessToken(res, jwt);
    return res.redirect('http://localhost:3001/signup/setting'); 
;
  }
  async requestPasswordReset({ email }: EmailCheckDto) {
    return await this.redisClient.requestPasswordReset({ email });
  }
  async resetPassword(userId: any, { newPassword }: PasswordCheckDto) {
    return await this.redisClient.resetPassword(userId, { newPassword });
  }

  async logOut(token?: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    return await this.redisClient.logout(token);
  }

  async refreshAccessToken(
    req: RequestWithUser,
    receivedRefreshToken: string,
    res: Response,
  ) {
    const { id } = req['user'];

    if (!id) {
      throw new UnauthorizedException();
    }
    const storedHashed = await this.redis.get(`refresh:${id}`);
    if (!storedHashed) {
      throw new BadRequestException('Something thing get wrong');
    }
    const isValid = await bcrypt.compare(receivedRefreshToken, storedHashed);
    if (!isValid) throw new UnauthorizedException();
    const { exp, ...payload } = req['user'];
    const newPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
    };
    const newAccessToken = await this.jwtStrategy.generateJwt(newPayload, '1h');
    this.cookiesStrategy.setAccessToken(res, newAccessToken);
    return { message: 'Access token updated' };
  }
}
