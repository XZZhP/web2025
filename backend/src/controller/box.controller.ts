// src/controller/box.controller.ts
import { Controller, Inject, Post, Get, Body } from '@midwayjs/core';
import { BoxService } from '../service/box.service';
import { Context } from '@midwayjs/koa';


@Controller('/api/box')
export class BoxController {

    @Inject()
    ctx: Context;

    @Inject()
    boxService: BoxService;

    /**
     * 创建盲盒
     */
    @Post('/')
    async createBox(
        @Body() body: {
            name: string;
            description: string;
            price: number;
            stock: number;
            coverImage: string;  // OSS URL字符串
            items: Array<{
                name: string;
                rarity: string;
                image: string;  // OSS URL字符串
                probability: number;
            }>;
        }
    ) {
        console.log('Creating box with data:', body);
        try {
            const box = await this.boxService.createBox({
                name: body.name,
                description: body.description,
                price: body.price,
                stock: body.stock,
                coverImage: body.coverImage,
                items: body.items.map(item => ({
                    ...item,
                    probability: Number(item.probability) // 确保是数字类型
                }))
            });

            return {
                success: true,
                data: box
            };
        } catch (err) {
            return {
                success: false,
                message: err.message || '创建盲盒失败'
            };
        }
    }

    /**
     * 获取盲盒列表
     */
    @Get('/')
    async getBoxes() {
        try {
            const boxes = await this.boxService.getActiveBoxes();
            return {
                success: true,
                data: boxes
            };
        } catch (err) {
            this.ctx.status = 500;
            return {
                success: false,
                message: '获取盲盒列表失败'
            };
        }
    }

    @Post('/purchase')
    async purchaseBox(@Body() body: { userId: number; boxId: number }) {
        return this.boxService.purchaseBox(body.userId, body.boxId);
    }
}