import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Data do pedido.',
    example: '2025-01-06T12:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Valor total do pedido.',
    example: 150.75,
  })
  @IsNotEmpty()
  @IsNumber()
  total: number;

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
