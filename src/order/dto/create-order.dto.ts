import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'Lista de ids dos produtos no pedido.',
    example: ['63d9f1e8f1c8c8a1a1a1a1a1', '63d9f1e8f1c8c8a1a1a1a2'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products: string[];
}
