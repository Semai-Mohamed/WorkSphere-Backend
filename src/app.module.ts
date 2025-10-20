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
import { ConversationModule } from './conversation/conversation.module';
import { NotificationModule } from './notification/notification.module';
import { ProjectModule } from './project/project.module';
import { OfferModule } from './offer/offer.module';
import { Project } from './project/project.entity';
import { Notification } from './notification/notification.entity';
import { Conversation } from './conversation/entity/conversation.entity';
import { Message } from './conversation/entity/message.entity';

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
      entities: [User,Project,Notification,Conversation,Message],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CaslModule,
    DashbordModule,
    ConversationModule,
    NotificationModule,
    ProjectModule,
    OfferModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}