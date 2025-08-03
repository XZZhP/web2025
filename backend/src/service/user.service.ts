import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Provide()
export class UserService {

  @InjectEntityModel(User)
  userModel: Repository<User>
  async getUser(username:string) {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async register(registerData: { username: string; email: string; password: string }) {
    const existingUser = await this.userModel.findOne({ where: { username: registerData.username } });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const user = this.userModel.create({ ...registerData, password: hashedPassword });
    return await this.userModel.save(user);
  }

  public async login(loginData: { username: string; password: string }) {
    const user = await this.userModel.findOne({ where: { username: loginData.username } });
    if (user && await bcrypt.compare(loginData.password, user.password)) {
      return user;
    }
    if (!user) {
      throw new Error('Invalid username or password');
    }
    return user;
  }
}
