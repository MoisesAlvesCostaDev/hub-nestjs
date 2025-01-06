import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';
import { Product } from 'src/product/schemas/product.schema';
import { getDefaultPagination } from '../config/pagination.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly configService: ConfigService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    if (createCategoryDto.products && createCategoryDto.products.length > 0) {
      const validProducts = await this.productModel.find({
        _id: { $in: createCategoryDto.products },
      });

      if (validProducts.length !== createCategoryDto.products.length) {
        throw new NotFoundException('One or more products not found');
      }
    }

    const category = new this.categoryModel(createCategoryDto);
    const savedCategory = await category.save();

    if (createCategoryDto.products && createCategoryDto.products.length > 0) {
      await this.productModel.updateMany(
        { _id: { $in: createCategoryDto.products } },
        { $push: { categories: savedCategory._id } },
      );
    }

    return savedCategory;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { page, limit } = paginationQuery;
    const { defaultPage, defaultLimit } = getDefaultPagination(
      this.configService,
    );

    const currentPage = page || defaultPage;
    const currentLimit = limit || defaultLimit;

    const skip = (currentPage - 1) * currentLimit;

    const [data, total] = await Promise.all([
      this.categoryModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'products',
          model: 'Product',
          select: 'name price description',
        })
        .exec(),
      this.categoryModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate({
        path: 'products',
        model: 'Product',
        select: 'name price description',
      })
      .exec();
    if (!category) {
      throw new NotFoundException(`Not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (updateCategoryDto.products?.length) {
      await this.productModel.updateMany(
        { _id: { $in: category.products } },
        { $pull: { categories: category._id } },
      );

      await this.productModel.updateMany(
        { _id: { $in: updateCategoryDto.products } },
        { $push: { categories: category._id } },
      );
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .populate({
        path: 'products',
        model: 'Product',
        select: 'name price description',
      })
      .exec();

    return updatedCategory;
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException(`Not found`);
    }

    if (category.products?.length) {
      await this.productModel.updateMany(
        { _id: { $in: category.products } },
        { $pull: { categories: category._id } },
      );
    }

    await this.categoryModel.findByIdAndDelete(id).exec();

    return { message: `Successfully deleted` };
  }
}
