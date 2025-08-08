import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as upload from '@midwayjs/upload';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';

import * as typeorm from '@midwayjs/typeorm';

@Configuration({
  imports: [
    koa,
    upload,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    typeorm,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', ctx.get('origin') || 'http://localhost:5173');
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
        return;
      }
      
      await next();
    });
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
