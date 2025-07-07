import { IUser } from '../app/models/users';

export class UserDto implements IUser {
  id: string;
  login: string;
  psw: string;
  cardNumber: string;
  email: string;
}
