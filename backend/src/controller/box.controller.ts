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
    async createBox(@Body() body: {
        name: string;
        description?: string;
        price: number;
        stock?: number;
        items: string;
        coverImage: string;
    }
    ) {

        try {
            // 验证必要参数


            // 处理上传的封面图
            // let coverImage = '';
            // if (files.cover?.[0]) {
            //     const coverFile = files.cover[0];
            //     coverImage = await this.boxService.uploadCoverImage(coverFile);
            // }

            // // OSS上传封面
            // let coverImage = '';
            // if (files.cover?.[0]) {
            //     const uploadResult = await this.ossService.putOSS(files.cover[0]);
            //     coverImage = uploadResult.url;
            //     console.log('封面图OSS地址:', coverImage);
            // }

            // 解析物品列表
            const items = JSON.parse(body.items || '[]');

            // 创建盲盒
            const box = await this.boxService.createBox({
                name: body.name,
                description: body.description,
                price: parseFloat(body.price.toString()),
                stock: parseInt(body.stock?.toString()) || 100,
                coverImage: body.coverImage,
                items
            });

            return {
                success: true,
                data: box
            };
        } catch (err) {
            this.ctx.status = 500;
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