import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getDefaultPagination } from 'src/config/pagination.config';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly configService: ConfigService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(createOrderDto);
    return await order.save();
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const { page, limit } = paginationQuery;
    const { defaultPage, defaultLimit } = getDefaultPagination(
      this.configService,
    );

    const currentPage = page || defaultPage;
    const currentLimit = limit || defaultLimit;

    const skip = (currentPage - 1) * currentLimit;

    const [data, total] = await Promise.all([
      this.orderModel
        .find()
        .skip(skip)
        .limit(currentLimit)
        .populate({
          path: 'products',
          model: 'Product',
          select: 'name price description',
        })
        .exec(),
      this.orderModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'products',
        model: 'Product',
        select: 'name price description',
      })
      .exec();

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate({
        path: 'products',
        model: 'Product',
        select: 'name price description',
      })
      .exec();

    return updatedOrder;
  }

  async remove(id: string): Promise<{ message: string }> {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    await order.deleteOne();

    return { message: `Successfully deleted` };
  }
}
