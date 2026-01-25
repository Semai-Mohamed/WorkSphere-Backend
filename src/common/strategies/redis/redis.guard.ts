/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from 'node_modules/@nestjs/common';
import { Request } from 'node_modules/@types/express';
import { JwtStrategy } from '../token/jwt.strategy';
import Redis from 'node_modules/ioredis/built';

@Injectable()
export class RedisGuard implements CanActivate {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.query.token as string;
    const userId = request.query.id as string;
    if (!token || !userId) {
      throw new UnauthorizedException('Missing token or user id');
    }
    const storedToken = await this.redisClient.get(`reset:${userId}`);

    if (!storedToken || storedToken !== token) {
      throw new BadRequestException('Invalid or expired token');
    }
    request['userId'] = userId;
    await this.redisClient.del(`reset:${userId}`);
    return true;
  }
}
