import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto.',
    example: 'Smartphone',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto.',
    example: 'Um smartphone moderno com 128GB de armazenamento.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Preço do produto.',
    example: 1299.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    description: 'URL da imagem associada ao produto.',
    example: 'https://example.com/images/product.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Lista de IDs das categorias associadas ao produto.',
    example: ['63d9f1e8f1c8c8a1a1a1a1a1', '63d9f1e8f1c8c8a1a1a1a2'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Arquivo de imagem do produto.',
  })
  file?: any;
}
