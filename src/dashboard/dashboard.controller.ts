import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard.query.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/metrics')
  @ApiOperation({
    summary: 'Obtem metricas do dashboard com base nos filtros fornecidos',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso.',
    schema: {
      example: {
        totalOrders: 150,
        totalRevenue: 450.75,
        averageOrderValue: 300.5,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro nos parâmetros fornecidos.',
  })
  async find(@Query() dashboardQuery: DashboardQueryDto) {
    return this.dashboardService.find(dashboardQuery);
  }

  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string', example: '2025-01-08' },
          total: { type: 'number', example: 2600.98 },
        },
      },
      example: [
        { date: '2025-01-08', total: 2600.98 },
        { date: '2025-01-09', total: 3400.5 },
      ],
    },
  })
  @Get('dailysales')
  async getDailySales() {
    return this.dashboardService.getDailySales();
  }
}
