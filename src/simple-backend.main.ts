import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/simple-app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:59177',
      'http://localhost:80',
      'http://localhost',
      /^http:\/\/localhost:\d+$/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  await app.listen(3000);
  console.log('Simple backend is running on port 3000');
}
bootstrap();
