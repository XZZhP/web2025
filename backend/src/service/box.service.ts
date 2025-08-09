// src/service/box.service.ts
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Box } from '../entity/box.entity';
import { BoxItem } from '../entity/box-item.entity';
import { UserItem } from '../entity/user-item.entity';

@Provide()
export class BoxService {
    @InjectEntityModel(Box)
    boxModel: Repository<Box>;

    @InjectEntityModel(UserItem)
    userItemModel: Repository<UserItem>;

    @InjectEntityModel(BoxItem)
    boxItemModel: Repository<BoxItem>;

    /**
     * 创建盲盒
     */
    async createBox(params: {
        name: string;
        description: string;
        price: number;
        stock: number;
        coverImage: string;
        items: Array<{
            name: string;
            rarity: string;
            image: string;
            probability: number;
        }>;
    }) {
        // 验证概率总和
        if (params.items.length > 0) {
            const totalProb = params.items.reduce((sum, item) => sum + item.probability, 0);
            if (totalProb !== 100) {
                throw new Error('物品概率总和必须等于100');
            }
        }

        // 创建盲盒
        const box = new Box();
        box.name = params.name;
        box.description = params.description;
        box.price = params.price;
        box.stock = params.stock;
        box.coverImage = params.coverImage;
        box.isActive = true;

        // 保存盲盒
        await this.boxModel.save(box);

        // 保存物品
        if (params.items.length > 0) {
            const items = params.items.map(item => {
                const boxItem = new BoxItem();
                boxItem.name = item.name;
                boxItem.rarity = item.rarity;
                boxItem.image = item.image;
                boxItem.probability = item.probability;
                boxItem.box = box;
                return boxItem;
            });
            await this.boxItemModel.save(items);
        }

        return box;
    }

    /**
     * 获取有效盲盒列表
     */
    async getActiveBoxes() {
        return this.boxModel.find({
            where: { isActive: true },
            relations: ['items'],
            order: { id: 'DESC' }
        });
    }

    //盲盒详情
    async getBoxDetail(id: number) {
        // 方法1: 使用Repository查询
        const box = await this.boxModel.findOne({
            where: { id },
            relations: ['items'] // 加载关联的items
        });

        return box;
    }

    // 购买盲盒
    async purchaseBox(userId: number, boxId: number) {
        const box = await this.boxModel.findOne({
            where: { id: boxId },
            relations: ['items']
        });

        if (!box || !box.isActive) {
            throw new Error('盲盒不存在或已下架');
        }

        if (box.stock <= 0) {
            throw new Error('库存不足');
        }

        // 随机获取物品
        const item = this.drawRandomItem(box.items);

        // 记录用户获得的物品
        const userItem = new UserItem();
        userItem.user = { id: userId } as any;
        userItem.item = item;
        await this.userItemModel.save(userItem);

        // 减少库存
        box.stock -= 1;
        await this.boxModel.save(box);

        return {
            success: true,
            data: {
                item: {
                    id: item.id,
                    name: item.name,
                    rarity: item.rarity,
                    image: item.image
                },
                remainingStock: box.stock
            }
        };
    }
    // 随机抽取物品
    private drawRandomItem(items: BoxItem[]): BoxItem {
        // 验证概率总和是否为100
        const totalProb = items.reduce((sum, item) => sum + item.probability, 0);
        if (totalProb !== 100) {
            throw new Error('物品概率总和必须等于100');
        }

        // 生成随机数
        const random = Math.random() * 100;
        let cumulativeProb = 0;

        for (const item of items) {
            cumulativeProb += item.probability;
            if (random <= cumulativeProb) {
                return item;
            }
        }
        // 如果没有匹配到，返回最后一个物品（理论上不应该到这里）
        return items[items.length - 1];
    }

    async deleteBox(boxId: number): Promise<void> {
        await this.boxModel.manager.transaction(async (transactionalEntityManager) => {
            // 1. 首先查询盲盒是否存在
            const box = await transactionalEntityManager.findOne(Box, {
                where: { id: boxId },
                relations: ['items'] // 加载关联的items
            });

            if (!box) {
                throw new Error('盲盒不存在');
            }

            // 2. 删除盲盒内的物品定义（BoxItem）
            await transactionalEntityManager.remove(box.items);

            // 3. 将盲盒标记为下架（软删除）
            box.isActive = false;
            await transactionalEntityManager.save(box);

        });
    }
}