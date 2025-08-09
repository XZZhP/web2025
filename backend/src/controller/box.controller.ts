// src/controller/box.controller.ts
import { Controller, Inject, Post, Get, Body, Param, Del } from '@midwayjs/core';
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

    @Get('/:id')
    async getBoxDetail(@Param('id') id: number) {
        try {
            const box = await this.boxService.getBoxDetail(id);
            if (!box) {
                this.ctx.status = 404;
                return {
                    success: false,
                    message: '盲盒不存在'
                };
            }
            return {
                success: true,
                data: box
            };
        } catch (err) {
            this.ctx.status = 500;
            return {
                success: false,
                message: err.message || '获取盲盒详情失败'
            };
        }
    }

    @Post('/purchase')
    async purchaseBox(@Body() body: { userId: number; boxId: number }) {
        return this.boxService.purchaseBox(body.userId, body.boxId);
    }


    @Del('/:id')
    async deleteBox(
        @Param('id') id: number,
    ) {
        // 可以添加权限验证，例如：
        // const userRole = this.ctx.user.role;
        // if (userRole !== 'admin') {
        //     throw new Error('无权执行此操作');
        // }

        await this.boxService.deleteBox(id);
        return { success: true, message: '盲盒删除成功' };
    }
}