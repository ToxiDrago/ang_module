import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../shemas/order';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find();
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderModel.findById(id);
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    const orderData = new this.orderModel(order);
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
