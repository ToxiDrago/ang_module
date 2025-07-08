import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrdersService } from '../../backend-services/orders.service';
import { OrderDto } from '../../dto/order-dto';
import { OrderValidationPipe } from '../../pipes/order-validation.pipe';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  @UsePipes(new OrderValidationPipe())
  createOrder(@Body() orderDto: OrderDto) {
    return this.ordersService.createOrder(orderDto);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
