import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controllers/users/users.controller';
import { ToursController } from './controllers/tours/tours.controller';
import { UsersService } from './backend-services/users.service';
import { ToursService } from './backend-services/tours.service';
import { User, UserSchema } from '../shemas/user';
import { Tour, TourSchema } from '../shemas/tour';
import { OrdersModule } from './orders.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../public'),
      serveRoot: '/public',
    }),
    MongooseModule.forRoot(
      process.env['MONGO_URL'] || 'mongodb://localhost:27017/yourdbname'
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tour.name, schema: TourSchema },
    ]),
    OrdersModule,
    AuthModule,
  ],
  controllers: [UsersController, ToursController],
  providers: [UsersService, ToursService],
})
export class BackendAppModule {}
