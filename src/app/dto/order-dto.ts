import { IsString, IsNotEmpty } from 'class-validator';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  age: string;

  @IsString()
  @IsNotEmpty()
  birthDay: string;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  _id?: string;
}
