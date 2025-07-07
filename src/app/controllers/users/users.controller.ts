import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../../shemas/user';
import { UserDto } from '../../../dto/user-dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  async sendUser(@Body() data: UserDto): Promise<User> {
    const exists = await this.userService.checkRegUser(data.login);
    if (exists.length === 0) {
      return this.userService.sendUser(data);
    } else {
      throw new Error('User already exists');
    }
  }

  @Post(':login')
  async authUser(
    @Body() data: UserDto,
    @Param('login') login: string
  ): Promise<boolean> {
    const found = await this.userService.checkAuthUser(data.login, data.psw);
    if (found.length !== 0) {
      return true;
    } else {
      throw new Error('Auth failed');
    }
  }

  @Put(':id')
  updateUsers(
    @Param('id') id: string,
    @Body() data: Partial<UserDto>
  ): Promise<User> {
    return this.userService.updateUsers(id, data);
  }

  @Delete()
  deleteUsers(): Promise<any> {
    return this.userService.deleteUsers();
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUserById(id);
  }
}
