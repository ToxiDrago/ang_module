import { IUser } from '../app/models/users';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UserDto implements IUser {
  id: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  psw: string;

  @IsString()
  @IsOptional()
  cardNumber: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
