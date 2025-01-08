import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DashboardQueryDto } from './dto/dashboard.query.dto';
import { Order } from '../order/schemas/order.schema';
import { Product } from '../product/schemas/product.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async find(filters: DashboardQueryDto) {
    const matchFilters = await this.buildMatchFilters(filters);

    const [result] = await this.orderModel.aggregate([
      { $match: matchFilters },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: 1,
        },
      },
    ]);

    return result || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
  }

  private async buildMatchFilters(filters: DashboardQueryDto) {
    const match: any = {};

    if (filters.startDate || filters.endDate) {
      match.date = {};
      if (filters.startDate) match.date.$gte = new Date(filters.startDate);
      if (filters.endDate) match.date.$lte = new Date(filters.endDate);
    }

    if (filters.product) {
      match.products = { $in: [filters.product] };
    }

    if (filters.category) {
      const productIds = await this.getProductsByCategory(filters.category);
      match.products = { $in: productIds };
    }

    return match;
  }

  private async getProductsByCategory(categoryId: string): Promise<string[]> {
    const products = await this.productModel
      .find({ categories: categoryId }, '_id')
      .exec();
    return products.map((product) => product._id.toString());
  }

  async getDailySales() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const dailySales = await this.orderModel.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lt: startOfNextMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
          },
          total: { $sum: '$total' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    return dailySales.map((sale) => ({
      date: new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(sale._id.year, sale._id.month - 1, sale._id.day)),
      total: sale.total,
    }));
  }
}
