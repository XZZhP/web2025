import { MidwayConfig } from '@midwayjs/core';
import * as path from 'path';

import { User } from '../entity/user.entity';
import { Box } from "../entity/box.entity";
import { BoxItem } from '../entity/box-item.entity';
import { UserItem } from '../entity/user-item.entity';

export default {
  keys: '1752296300733_6960',
  koa: {
    port: 7001,
  },
  cors: {
    origin: 'http://localhost:5173', // 你的前端地址
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: path.join(__dirname, 'webapp.sqlite'), // 推荐放到项目根目录
        synchronize: true,
        logging: true,
        entities: [User, Box, BoxItem, UserItem],

      }
    }
  },
  aliyunOSS: {
    endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
    bucketName: 'szrg2',
  },


} as MidwayConfig;