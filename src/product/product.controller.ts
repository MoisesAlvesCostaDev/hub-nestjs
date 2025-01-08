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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { isValidObjectId } from 'mongoose';
import { ValidateObjectIdPipe } from 'src/pipes/ValidateObjectIdPipe';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria um novo produt' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso.',
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro nos dados enviados.',
  })
  create(
    @Body() body: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parsePrice = (price: any): number => {
      return Number(price);
    };

    const parseCategories = (categories: any): string[] => {
      if (typeof categories === 'string') {
        try {
          return JSON.parse(categories);
        } catch (error) {
          console.error('Error parsing categories string:', error);
          return [];
        }
      }
      return Array.isArray(categories) ? categories : [];
    };

    const parsedBody = {
      ...body,
      price: parsePrice(body.price),
      categories: parseCategories(body.categories),
    };

    return this.productService.create(parsedBody, file);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista produts.',
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.productService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtem um produto' })
  @ApiParam({
    name: 'id',
    description: 'Id do produto.',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado.',
  })
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Formato de id inválido`);
    }
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualiza um produt pelo id' })
  @ApiParam({
    name: 'id',
    description: 'Id do produto.',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso!',
    type: UpdateProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Formato de Id inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado.',
  })
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Formato de Id inválido`);
    }

    const parsePrice = (price: any): number => {
      return Number(price);
    };

    const parseCategories = (categories: any): string[] => {
      if (typeof categories === 'string') {
        try {
          return JSON.parse(categories);
        } catch (error) {
          console.error('Error parsing categories string:', error);
          return [];
        }
      }
      return Array.isArray(categories) ? categories : [];
    };

    const parsedBody = {
      ...body,
      price: parsePrice(body.price),
      categories: parseCategories(body.categories),
    };

    return this.productService.update(id, parsedBody, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produto pelo Id' })
  @ApiParam({
    name: 'id',
    description: 'Id do produto no formato ObjectId.',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto removido com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Formato de Id inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado.',
  })
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Formato de id inválido`);
    }
    return this.productService.remove(id);
  }
}
