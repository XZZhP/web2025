import { Controller, Inject, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';


@Controller('/api/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() registerData: {
    username: string;
    email: string;  
    password: string;
  }) {
    const user = await this.userService.register(registerData);
    if (!user) {
      return { success: false, message: 'Registration failed', data: null };
    }
    return { success: true, message: 'OK', data: null };
  }

  @Post('/login')
  async login(@Body() loginData: {
    username: string;
    password: string;
  }) {
    const user = await this.userService.login(loginData);
    if (!user) {
      return { success: false, message: 'Login failed', data: null };
    }
    return { success: true, message: 'OK', data: null };
  }

  
}