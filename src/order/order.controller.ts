import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ValidateObjectIdPipe } from 'src/pipes/ValidateObjectIdPipe';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso.',
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados invalidos.',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos com paginação' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista paginada de pedidos.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.orderService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um pedido pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido no formato ObjectId.',
    example: '63d9f1e8f1c8c8a1a1a1a1a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado.',
  })
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um pedido pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido no formato ObjectId.',
    example: '63d9f1e8f1c8c8a1a1a1a1a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso.',
    type: UpdateOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado.',
  })
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um pedido pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido no formato ObjectId.',
    example: '63d9f1e8f1c8c8a1a1a1a1a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado.',
  })
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.orderService.remove(id);
  }
}
