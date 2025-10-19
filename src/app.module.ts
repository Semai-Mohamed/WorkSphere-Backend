/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { DashbordModule } from './dashbord/dashbord.module';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath : '.development.env',isGlobal:true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CaslModule,
    DashbordModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}