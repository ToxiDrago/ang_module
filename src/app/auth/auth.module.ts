import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UsersService } from '../backend-services/users.service';
import { User, UserSchema } from '../../shemas/user';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, UsersService],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
