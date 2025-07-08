import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../backend-services/users.service';
import { UserDto } from '../../dto/user-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() userDto: UserDto) {
    // Проверяем, существует ли пользователь
    const existingUsers = await this.usersService.checkRegUser(userDto.login);
    if (existingUsers.length > 0) {
      throw new UnauthorizedException('User already exists');
    }

    // Создаем нового пользователя
    const newUser = await this.usersService.sendUser({
      ...userDto,
      role: userDto.role || 'user',
    });

    // Генерируем JWT токен
    const payload = { login: newUser.login, sub: newUser._id };
    const access_token = this.jwtService.sign(payload);

    // Сохраняем refresh token
    this.usersService.saveRefreshToken(newUser._id, access_token);

    return {
      access_token,
      user: {
        id: newUser._id,
        login: newUser.login,
        email: newUser.email,
      },
    };
  }

  @Post('login')
  async login(@Body() loginDto: { login: string; psw: string }) {
    // Проверяем пользователя
    const users = await this.usersService.checkAuthUser(
      loginDto.login,
      loginDto.psw
    );

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];

    // Генерируем JWT токен
    const payload = { login: user.login, sub: user._id };
    const access_token = this.jwtService.sign(payload);

    // Сохраняем refresh token
    this.usersService.saveRefreshToken(user._id, access_token);

    return {
      access_token,
      user: {
        id: user._id,
        login: user.login,
        email: user.email,
      },
    };
  }
}
