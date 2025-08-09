import { Controller, Inject, Post, Get, Put, Body, Param } from '@midwayjs/core';
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
    role: string;
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
    this.ctx.session.userId = user.id;
    console.log('登录成功用户ID:', user.role);
    return { success: true, message: 'OK', data: { userId: user.id, username: user.username, role: user.role } };
  }

  // 获取用户信息
  @Get('/profile/:username')
  async getProfile(@Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    // 返回脱敏后的用户信息
    return {
      success: true,
      data: {
        username: user.username,
        email: user.email,
        role: user.role,
        // 其他不敏感信息
      }
    };
  }

  // 修改密码
  @Put('/password')
  async changePassword(@Body() body: { username: string; currentPassword: string; newPassword: string }) {
    const { currentPassword, newPassword } = body;
    const user = await this.userService.getUserByUsername(body.username);

    const result = await this.userService.changePassword(
      user.id,
      currentPassword,
      newPassword
    );

    if (!result.success) {
      this.ctx.status = 400;
    }

    return result;
  }

  @Get('/items/:userId')
  async getUserItems(@Param('userId') userId: number) {
    return this.userService.getUserItems(userId);
  }
}