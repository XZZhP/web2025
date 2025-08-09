// src/controller/showcase.controller.ts
import { Controller, Inject, Post, Get, Body, Param } from '@midwayjs/core';
import { ShowcaseService } from '../service/showcase.service';
import { Context } from '@midwayjs/koa';

@Controller('/api/showcase')
export class ShowcaseController {
    @Inject()
    ctx: Context;

    @Inject()
    showcaseService: ShowcaseService;

    // 发布展示
    @Post('/')
    async create(@Body() body: { userId: number; userItemId: number; comment: string }) {
        try {
            const showcase = await this.showcaseService.createShowcase(
                body.userId,
                body.userItemId,
                body.comment
            );
            return {
                success: true,
                data: showcase
            };
        } catch (err) {
            return {
                success: false,
                message: err.message
            };
        }
    }

    // 获取展示列表
    @Get('/')
    async list(@Param('page') page: number = 1, @Param('limit') limit: number = 10) {
        try {
            console.log(`Fetching showcases: page=${page}, limit=${limit}`);
            const data = await this.showcaseService.getShowcases(page, limit);
            console.log(`Fetched showcases: ${JSON.stringify(data)}`);
            return {
                success: true,
                data
            };
        } catch (err) {
            return {
                success: false,
                message: '获取展示列表失败'
            };
        }
    }

    // 点赞
    @Post('/:id/like')
    async like(@Param('id') id: number) {
        try {
            const showcase = await this.showcaseService.likeShowcase(id);
            return {
                success: true,
                data: showcase
            };
        } catch (err) {
            return {
                success: false,
                message: '点赞失败'
            };
        }
    }

    // 获取用户自己的展示
    @Get('/user/:userId')
    async userList(@Param('userId') userId: number) {
        try {
            const list = await this.showcaseService.getUserShowcases(userId);
            return {
                success: true,
                data: list
            };
        } catch (err) {
            return {
                success: false,
                message: '获取用户展示失败'
            };
        }
    }
}