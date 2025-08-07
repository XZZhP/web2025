import { Provide, Inject } from '@midwayjs/core';
import { OssUtil } from '../util/oss.util';

@Provide()
export class ImageService {
  @Inject()
  ossUtil: OssUtil;

  async upload(file: any): Promise<string> {
    try {
      return await this.ossUtil.upload(file.filename, file.data);
    } catch (e) {
      throw new Error('图片上传失败');
    }
  }
}