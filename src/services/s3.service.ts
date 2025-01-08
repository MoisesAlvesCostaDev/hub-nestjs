import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      s3ForcePathStyle: true,
      region: this.configService.get<string>('AWS_DEFAULT_REGION'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    return this.s3.upload(params).promise();
  }

  async deleteFile(key: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };
    await this.s3.deleteObject(params).promise();
  }
}
