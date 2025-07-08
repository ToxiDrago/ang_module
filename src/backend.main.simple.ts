import { NestFactory } from '@nestjs/core';
import { BackendAppModule } from './app/backend-app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(BackendAppModule);
    app.enableCors({
      origin: 'http://localhost:4200',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      credentials: true,
    });

    // Добавляем обработчик ошибок
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Error:', err);
      res.status(500).json({ error: err.message });
    });

    await app.listen(3000);
    console.log('✅ NestJS backend running on http://localhost:3000');
    console.log('🔧 Ready for testing!');
  } catch (error) {
    console.error('❌ Failed to start backend:', error);
    process.exit(1);
  }
}

bootstrap();
