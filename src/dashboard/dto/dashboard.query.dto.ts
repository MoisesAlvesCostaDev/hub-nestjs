import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardQueryDto {
  @ApiPropertyOptional({
    description: 'id da categoria para filtrar os resultados.',
    example: '63d9f1e8f1c8c8a1a1a1a1a1',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'id do produto para filtrar os resultados.',
    example: '63d9f1e8f1c8c8a1a1a1a1b2',
  })
  @IsOptional()
  @IsString()
  product?: string;

  @ApiPropertyOptional({
    description: 'Data inicial para o filtro no formato.',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final para o filtro no formato.',
    example: '2025-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
