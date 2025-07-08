import { NestFactory } from '@nestjs/core';
import { BackendAppModule } from './app/backend-app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BackendAppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:59177',
      'http://localhost:80',
      'http://localhost',
      /^http:\/\/localhost:\d+$/, // Разрешаем все localhost порты
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  await app.listen(3000);
  console.log('NestJS backend running on http://localhost:3000');
}

bootstrap();
