import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ValidateObjectIdPipe } from '../pipes/ValidateObjectIdPipe';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso.',
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro nos dados enviados.',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.name) {
      throw new BadRequestException('O nome da categoria é obrigatório');
    }
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias com paginação' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista paginada de categorias.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro no servidor.',
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.categoryService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma categoria pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria no formato de ObjectId',
    example: '63d9f1e8f1c8c8a1a1a1a1a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma categoria pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria no formato de ObjectId',
    example: '63d9f1e8f1c8c8a1a1a1a1a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma categoria pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria no formato de ObjectId',
    example: '63d9f1e8f1c8c8a1a1a1a1a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria removida com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
