import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../../backend-services/users.service';
import { UserDto } from '../../../dto/user-dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.usersService.sendUser(userDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: Partial<UserDto>) {
    return this.usersService.updateUsers(id, body);
  }

  @Delete()
  deleteUsers() {
    return this.usersService.deleteUsers();
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
