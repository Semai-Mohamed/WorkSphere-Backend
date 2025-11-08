import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { ConversationModule } from './conversation/conversation.module';
import { NotificationModule } from './notification/notification.module';
import { ProjectModule } from './project/project.module';
import { OfferModule } from './offer/offer.module';
import { Project } from './project/project.entity';
import { Notification } from './notification/notification.entity';
import { Conversation } from './conversation/entity/conversation.entity';
import { Message } from './conversation/entity/message.entity';
import { Offre } from './offer/offer.entity';
import { PortfolioModule } from './portfolio/portfolio.module';
import { Portfolio } from './portfolio/portfolio.entity';
import { PaymentModule } from './payment/payment.module';
import { APP_GUARD } from 'node_modules/@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.development.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        User,
        Project,
        Notification,
        Conversation,
        Message,
        Offre,
        Portfolio,
      ],
      synchronize: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 6000,
          limit: 10,
        },
      ],
    }),
    UserModule,
    AuthModule,
    CaslModule,
    ConversationModule,
    NotificationModule,
    ProjectModule,
    OfferModule,
    PortfolioModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
