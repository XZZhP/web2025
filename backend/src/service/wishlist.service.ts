// src/service/wishlist.service.ts
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entity/wishlist.entity';

@Provide()
export class WishlistService {
  @InjectEntityModel(Wishlist)
  wishlistRepo: Repository<Wishlist>;

  async addToWishlist(userId: number, boxId: number) {
    // 检查是否已存在
    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, box: { id: boxId } }
    });
    
    if (existing) {
      throw new Error('该盲盒已在心愿单中');
    }

    return this.wishlistRepo.save({
      user: { id: userId },
      box: { id: boxId }
    });
  }

  async removeFromWishlist(userId: number, boxId: number) {
    const result = await this.wishlistRepo.delete({
      user: { id: userId },
      box: { id: boxId }
    });
    
    if (result.affected === 0) {
      throw new Error('心愿单中未找到该盲盒');
    }
  }

  async getUserWishlist(userId: number) {
    return this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['box', 'box.items']
    });
  }
}