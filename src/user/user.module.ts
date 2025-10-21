/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { GoogleService } from './strategies.service/google.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [
    forwardRef(() =>AuthModule),
    TypeOrmModule.forFeature([User])
    
  ],
  controllers: [UserController],
  providers: [UserService,GoogleService],
  exports : [UserService,GoogleService]
})
export class UserModule {}
 