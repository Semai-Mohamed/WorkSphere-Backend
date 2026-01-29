import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './filters/filter.exceptions';
import { RedisIoAdapter } from './common/strategies/redis/redis.io.adapter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = new DocumentBuilder()
    .setTitle('WorkSphere')
    .setDescription('API for the WorkSphere application')
    .setVersion('1.0')
    .addTag('Platform')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const asyncApiOption = new AsyncApiDocumentBuilder()
    .setTitle('WebSocket API')
    .setDescription('Notification and Conversation WebSocket APIs')
    .setVersion('1.0')
    .setContact(
      'WorkSphere',
      'https://github.com/Semai-Mohamed',
      'WorkSphere@gmail.com',
    )
    .addServer('notification-ws', {
      url: 'ws://localhost:60/notification',
      protocol: 'socket.io',
      description: 'Notification WebSocket server',
    })
    .addServer('conversation-ws', {
      url: 'ws://localhost:80/conversation',
      protocol: 'socket.io',
      description: 'Conversation WebSocket server',
    })

    .build();
  const document = AsyncApiModule.createDocument(app, asyncApiOption);
  await AsyncApiModule.setup('/asyncapi', app, document);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // Attach microservice
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  // Redis Adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);


  app.enableCors({
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  }); 

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
