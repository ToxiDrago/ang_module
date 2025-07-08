import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimpleController } from './simple.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env['MONGO_URL'] || 'mongodb://localhost:27017/yourdbname'
    ),
  ],
  controllers: [SimpleController],
})
export class AppModule {}
