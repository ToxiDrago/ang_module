import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controllers/users/users.controller';
import { ToursController } from './controllers/tours/tours.controller';
import { UsersService } from './services/users/users.service';
import { ToursService } from './services/tours/tours.service';
import { User, UserSchema } from '../shemas/user';
import { Tour, TourSchema } from '../shemas/tour';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/yourdbname'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tour.name, schema: TourSchema },
    ]),
  ],
  controllers: [UsersController, ToursController],
  providers: [UsersService, ToursService],
})
export class BackendAppModule {}
