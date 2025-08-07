import { Controller, Post, Inject, Files } from '@midwayjs/core';
import { ImageService } from '../service/image.service';

@Controller('/api/image')
export class ToolsController {
  @Inject()
  imageService: ImageService;

  @Post('/')
  async upload(@Files() files: any[]) {
    if (!files || files.length === 0) {
      throw new Error('请选择文件');
    }
    const file = files[0];
    const url = await this.imageService.upload(file);
    return {
      code: 200,
      message: 'success',
      data: url,
    };
  }
}