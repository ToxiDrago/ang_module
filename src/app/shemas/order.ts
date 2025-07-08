import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  age: string;

  @Prop()
  birthDay: string;

  @Prop()
  cardNumber: string;

  @Prop()
  tourId: string;

  @Prop()
  userId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
