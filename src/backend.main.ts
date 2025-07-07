import { NestFactory } from '@nestjs/core';
import { BackendAppModule } from './app/backend-app.module';

async function bootstrap() {
  const app = await NestFactory.create(BackendAppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  await app.listen(3000);
  console.log('NestJS backend running on http://localhost:3000');
}

bootstrap();
