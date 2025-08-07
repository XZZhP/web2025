import { Provide, Config } from '@midwayjs/core';
import * as OSS from 'ali-oss';

@Provide()
export class OssUtil {
  @Config('aliyunOSS')
  private ossConfig;

  private client: OSS;

  async initClient() {
    if (!this.client) {
      this.client = new OSS({
        region: this.ossConfig.endpoint.replace('https://', '').replace('.aliyuncs.com', ''),
        accessKeyId: this.ossConfig.accessKeyId,
        accessKeySecret: this.ossConfig.accessKeySecret,
        bucket: this.ossConfig.bucketName,
      });
    }
    return this.client;
  }

  async upload(objectName: string, stream: any): Promise<string> {
    await this.initClient();
    try {
      const result = await this.client.put(objectName, stream);
      return result.url.split('?')[0]; // 返回不带签名的URL
    } catch (err) {
      throw new Error('文件上传失败');
    }
  }
}