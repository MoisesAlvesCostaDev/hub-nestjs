import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        MONGO_DB_NAME: Joi.string().required(),
        MONGO_USER: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        PAGINATION_DEFAULT_PAGE: Joi.number().default(1),
        PAGINATION_DEFAULT_LIMIT: Joi.number().default(10),
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
        user: configService.get<string>('MONGO_USER'),
        pass: configService.get<string>('MONGO_PASSWORD'),
      }),
    }),

    CategoryModule,

    ProductModule,

    OrderModule,

    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
