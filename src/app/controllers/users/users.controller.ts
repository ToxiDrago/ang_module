import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from '../../backend-services/users.service';
import { User } from '../../../shemas/user';
import { UserDto } from '../../../dto/user-dto';
import { jwtConstants } from '../../auth/constants';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post('login')
  async login(@Body() data: UserDto) {
    const found = await this.userService.checkAuthUser(data.login, data.psw);
    if (found.length !== 0) {
      const payload = { login: data.login, sub: found[0]._id };
      const access_token = this.jwtService.sign(payload);
      const refresh_token = this.jwtService.sign(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiresIn,
      });
      this.userService.saveRefreshToken(found[0]._id, refresh_token);
      return { access_token, refresh_token };
    } else {
      throw new Error('Auth failed');
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    try {
      const payload = this.jwtService.verify(body.refresh_token, {
        secret: jwtConstants.refreshSecret,
      });
      const savedToken = this.userService.getRefreshToken(payload.sub);
      if (savedToken !== body.refresh_token) {
        throw new Error('Invalid refresh token');
      }
      const newAccessToken = this.jwtService.sign({
        login: payload.login,
        sub: payload.sub,
      });
      return { access_token: newAccessToken };
    } catch (e) {
      throw new Error('Refresh failed');
    }
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
