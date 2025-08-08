import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Provide()
export class UserService {

  @InjectEntityModel(User)
  userModel: Repository<User>
  async getUserByUsername(username: string) {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async register(registerData: { username: string; email: string; password: string;role:string }) {
    const existingUser = await this.userModel.findOne({ where: { username: registerData.username } });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const user = this.userModel.create({ ...registerData, password: hashedPassword });
    return await this.userModel.save(user);
  }

  public async login(loginData: { username: string; password: string }) {
    const user = await this.userModel.findOne({ where: { username: loginData.username }, select: ['id', 'username', 'password'] });
    console.log('存储的哈希:', user.password);
    console.log('输入的密码:', loginData.password);
    if (user && await bcrypt.compare(loginData.password, user.password)) {
      return user;
    }
    if (!user) {
      throw new Error('Invalid username or password');
    }
    return user;
  }

  async getUserById(id: number) {
    return await this.userModel.findOne({ where: { id } });
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.userModel.findOne({ where: { id: userId } });

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    // 验证当前密码
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: '当前密码不正确' };
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userModel.save(user);

    return { success: true, message: '密码修改成功' };
  }
}
