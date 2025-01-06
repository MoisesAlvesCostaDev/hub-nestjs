import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Eletrônicos',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example:
      'Categoria para produtos eletrônicos como celulares, tablets, etc.',
  })
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Lista de IDs de produtos associados à categoria',
    example: ['63d9f1e8f1c8c8a1a1a1a1a1', '63d9f1e8f1c8c8a1a1a1a1a2'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products: string[];
}
