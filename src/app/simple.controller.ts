import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('api')
export class SimpleController {
  @Get('health')
  getHealth() {
    return { status: 'OK', message: 'Backend is running' };
  }

  @Post('test')
  testEndpoint(@Body() body: any) {
    return {
      status: 'OK',
      message: 'Test endpoint working',
      received: body,
    };
  }

  @Get('users')
  getUsers() {
    return [
      { id: 1, name: 'Test User 1' },
      { id: 2, name: 'Test User 2' },
    ];
  }
}
