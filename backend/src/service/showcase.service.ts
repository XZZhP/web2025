// src/service/showcase.service.ts
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Showcase } from '../entity/showcase.entity';
import { UserItem } from '../entity/user-item.entity';

@Provide()
export class ShowcaseService {
  @InjectEntityModel(Showcase)
  showcaseRepo: Repository<Showcase>;

  @InjectEntityModel(UserItem)
  userItemRepo: Repository<UserItem>;

  // 发布展示
  async createShowcase(userId: number, userItemId: number, comment: string) {
    const userItem = await this.userItemRepo.findOne({
      where: { id: userItemId, user: { id: userId } },
      relations: ['item']
    });

    if (!userItem) {
      throw new Error('物品不存在或不属于该用户');
    }

    const showcase = new Showcase();
    showcase.userItem = userItem;
    showcase.user = { id: userId } as any;
    showcase.comment = comment;

    return this.showcaseRepo.save(showcase);
  }

  // 获取展示列表
  async getShowcases(page = 1, limit = 10) {
    const [list, total] = await this.showcaseRepo.findAndCount({
      relations: ['user', 'userItem', 'userItem.item'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      list,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // 点赞
  async likeShowcase(id: number) {
    await this.showcaseRepo.increment({ id }, 'likes', 1);
    return this.showcaseRepo.findOne({ where: { id } });
  }

  // 获取用户自己的展示
  async getUserShowcases(userId: number) {
    return this.showcaseRepo.find({
      where: { user: { id: userId } },
      relations: ['userItem', 'userItem.item'],
      order: { createdAt: 'DESC' }
    });
  }
}