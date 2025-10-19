/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from 'node_modules/@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from 'src/roles.guard';

@Module({
  imports : [
    UserModule,
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
  providers: [AuthService,
    {
      provide : APP_GUARD,
      useClass : AuthGuard
    },
    {
      provide : APP_GUARD,
      useClass : RolesGuard
    }
  ]
})
export class AuthModule {}