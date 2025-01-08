import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/schemas/category.schema';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getDefaultPagination } from 'src/config/pagination.config';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/services/s3.service';
import * as crypto from 'crypto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    if (createProductDto.categories && createProductDto.categories.length > 0) {
      const validCategories = await this.categoryModel.find({
        _id: { $in: createProductDto.categories },
      });

      if (validCategories.length !== createProductDto.categories.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }
    if (file) {
      const uniqueId = crypto.randomUUID();
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `${uniqueId}.${fileExtension}`;
      const uploadResult = await this.s3Service.uploadFile(
        file,
        uniqueFileName,
      );
      createProductDto.imageUrl = uploadResult.Location;
    }

    const product = new this.productModel(createProductDto);
    const savedProduct = await product.save();

    if (createProductDto.categories?.length) {
      await this.categoryModel.updateMany(
        { _id: { $in: createProductDto.categories } },
        { $push: { products: savedProduct._id } },
      );
    }

    return savedProduct;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { page, limit } = paginationQuery;
    const { defaultPage, defaultLimit } = getDefaultPagination(
      this.configService,
    );

    const currentPage = page || defaultPage;
    const currentLimit = limit || defaultLimit;

    const skip = (currentPage - 1) * currentLimit;

    const [data, total] = await Promise.all([
      this.productModel
        .find()
        .skip(skip)
        .limit(currentLimit)
        .populate({
          path: 'categories',
          model: 'Category',
          select: 'name',
        })
        .exec(),
      this.productModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate({ path: 'categories', model: 'Category', select: 'name' })
      .exec();

    if (!product) {
      throw new NotFoundException(`Not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Not found`);
    }

    if (updateProductDto.categories?.length) {
      await this.categoryModel.updateMany(
        { _id: { $in: product.categories } },
        { $pull: { products: product._id } },
      );

      await this.categoryModel.updateMany(
        { _id: { $in: updateProductDto.categories } },
        { $push: { products: product._id } },
      );
    }

    if (file) {
      const uniqueId = crypto.randomUUID();
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `${uniqueId}.${fileExtension}`;
      const uploadResult = await this.s3Service.uploadFile(
        file,
        uniqueFileName,
      );
      updateProductDto.imageUrl = uploadResult.Location;
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('categories')
      .exec();

    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Not found`);
    }

    if (product.categories?.length) {
      await this.categoryModel.updateMany(
        { _id: { $in: product.categories } },
        { $pull: { products: product._id } },
      );
    }

    await product.deleteOne();

    return { message: `Successfully deleted` };
  }
}
