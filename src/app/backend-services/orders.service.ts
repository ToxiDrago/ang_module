import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../shemas/order';
import { OrderDto } from '../dto/order-dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async getAllOrders(
    userId?: string,
    page?: number,
    limit?: number
  ): Promise<Order[]> {
    const query = userId ? { userId } : {};
    let findQuery = this.orderModel.find(query);
    if (page && limit) {
      findQuery = findQuery.skip((page - 1) * limit).limit(limit);
    }
    return findQuery;
  }

  async getAllOrdersDetailed(userId?: string): Promise<any[]> {
    const query = userId ? { userId } : {};
    return this.orderModel
      .find(query)
      .populate('userId')
      .populate('tourId')
      .exec();
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderModel.findById(id);
  }

  async createOrder(data: OrderDto): Promise<Order> {
    const orderData = new this.orderModel(data);
    return orderData.save();
  }

  async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(id, order, { new: true });
  }

  async deleteOrder(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id);
  }

  async deleteAllOrders(): Promise<void> {
    await this.orderModel.deleteMany({});
  }
}
