import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { OrderDto } from '../dto/order-dto';

@Injectable()
export class OrderValidationPipe implements PipeTransform {
  transform(value: OrderDto, metadata: ArgumentMetadata) {
    // Пример: возраст должен быть числом и >= 18
    const age = Number(value.age);
    if (isNaN(age) || age < 18) {
      throw new BadRequestException('Возраст должен быть не менее 18 лет');
    }
    // Пример: номер карты должен быть не менее 8 символов
    if (!value.cardNumber || value.cardNumber.length < 8) {
      throw new BadRequestException('Некорректный номер карты');
    }
    return value;
  }
}
