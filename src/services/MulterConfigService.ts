import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

@Injectable()
export class MulterConfigService {
  private s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT'),
      s3ForcePathStyle: true, // Necessário para LocalStack
    });
  }

  getMulterConfig() {
    return multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        acl: 'public-read',
        key: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    });
  }
}
