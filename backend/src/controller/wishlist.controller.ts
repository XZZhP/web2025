// src/controller/wishlist.controller.ts
import { Controller, Inject, Post, Get, Body, Param, Del } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { WishlistService } from '../service/wishlist.service';

@Controller('/api/wishlist')
export class WishlistController {
  @Inject()
  ctx: Context;

  @Inject()
  wishlistService: WishlistService;

  /**
   * 添加盲盒到心愿单
   */
  @Post('/')
  async addToWishlist(@Body() body: { userId: number; boxId: number }) {
    try {
      const result = await this.wishlistService.addToWishlist(body.userId, body.boxId);
      return {
        success: true,
        data: result
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }

  /**
   * 从心愿单移除
   */
  @Del('/')
  async removeFromWishlist(@Body() body: { userId: number; boxId: number }) {
    try {
      await this.wishlistService.removeFromWishlist(body.userId, body.boxId);
      return {
        success: true
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }

  /**
   * 获取用户心愿单
   */
  @Get('/:userId')
  async getUserWishlist(@Param('userId') userId: number) {
    try {
      const wishlist = await this.wishlistService.getUserWishlist(userId);
      return {
        success: true,
        data: wishlist
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }
}