import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../app/models/users';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements IUser {
  _id?: string;
  @Prop({ required: true, unique: true }) login: string;
  @Prop({ required: true }) psw: string;
  @Prop() cardNumber: string;
  @Prop() email: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
