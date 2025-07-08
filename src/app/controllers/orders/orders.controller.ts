import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  Request,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../../backend-services/orders.service';
import { OrderDto } from '../../dto/order-dto';
import { OrderValidationPipe } from '../../pipes/order-validation.pipe';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthRequest extends ExpressRequest {
  user?: any;
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  getOrders(
    @Request() req: AuthRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const userId = req.user?.sub;
    return this.ordersService.getAllOrders(userId, page, limit);
  }

  @Get('detailed')
  getOrdersDetailed(@Request() req: AuthRequest) {
    const userId = req.user?.sub;
    return this.ordersService.getAllOrdersDetailed(userId);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  @UsePipes(new OrderValidationPipe())
  createOrder(@Body() orderDto: OrderDto, @Request() req: AuthRequest) {
    const userId = req.user?.sub;
    return this.ordersService.createOrder({ ...orderDto, userId });
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
