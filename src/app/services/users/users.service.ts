import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../shemas/user';
import { UserDto } from '../../../dto/user-dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    console.log('userService run');
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async sendUser(data: UserDto): Promise<User> {
    const userData = new this.userModel(data);
    return userData.save();
  }

  async updateUsers(id: string, body: Partial<UserDto>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, body, { new: true });
  }

  async deleteUsers(): Promise<any> {
    return this.userModel.deleteMany({});
  }

  async deleteUserById(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async checkAuthUser(login: string, password: string): Promise<User[]> {
    return this.userModel.find({ login, password });
  }

  async checkRegUser(login: string): Promise<User[]> {
    return this.userModel.find({ login });
  }
}
