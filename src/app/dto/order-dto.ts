import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ITour } from '../models/tours';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => TourDto)
  tour?: TourDto;

  _id?: string;
}

export class TourDto implements ITour {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  tourOperator: string;

  @IsString()
  price: string;

  @IsString()
  img: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  date?: string;
}
