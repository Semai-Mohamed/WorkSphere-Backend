/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from 'node_modules/@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from '../common/strategies/token/jwt.strategy';
import { GoogleStrategy } from '../common/strategies/google.strategy';
import Redis from 'ioredis';
import { RedisClient } from '../common/strategies/redis/redis.client';
import { RedisGuard } from '../common/strategies/redis/redis.guard';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { NodeMailderStrategy } from '../common/strategies/nodemailer.strategy';
import { CookiesStrategy } from '../common/strategies/token/cookies.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),
   
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    RedisClient,
    RedisGuard,
    NodeMailderStrategy,
    CookiesStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const redisUrl = configService.get<string>('REDIS_URL');

    // 1. Production / Upstash
    if (redisUrl) {

      return new Redis(redisUrl, {
        family: 4,
        tls: {
          rejectUnauthorized: false
        },
      });
    }

    // 2. Localhost Fallback
    
    return new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
  },
  inject: [ConfigService],
},
  ],
  exports: [JwtStrategy, GoogleStrategy, 'REDIS_CLIENT'],
})
export class AuthModule {}
