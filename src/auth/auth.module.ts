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
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import Redis from 'ioredis';
import { RedisClient } from './strategies/redis.strategy/redis.client';
import { RedisGuard } from './strategies/redis.strategy/redis.guard';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { NodeMailderStrategy } from './strategies/nodemailer.strategy';
@Module({
  imports : [
    TypeOrmModule.forFeature([User]),
    forwardRef(() =>UserModule),
    // نستحق هذي فل web socket
    ClientsModule.register([
      {
        name: 'Client_REDIS_SERVICE', 
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:  (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' }, 
      }),
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,GoogleStrategy,RedisClient,RedisGuard,NodeMailderStrategy,
    {
      provide : APP_GUARD,
      useClass : AuthGuard
    },
     {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    
  ],
  exports : [JwtStrategy,GoogleStrategy,]
})
export class AuthModule {}