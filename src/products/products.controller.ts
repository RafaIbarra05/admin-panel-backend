import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import {
  ApiBadRequest,
  ApiConflict,
  ApiNotFound,
  ApiUnauthorized,
} from 'src/common/docs/swagger.decorators';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @ApiOperation({ summary: 'List products' })
  @ApiOkResponse({ type: [ProductResponseDto] })
  @ApiUnauthorized()
  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return data.map((p) => {
      ProductResponseDto.from(p);
    });
  }

  @ApiOperation({ summary: 'Create product' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  @ApiUnauthorized()
  @ApiBadRequest()
  @ApiConflict()
  @Post()
  async create(@Body() dto: CreateProductDto) {
    const created = await this.service.create(dto);
    return ProductResponseDto.from(created);
  }
  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiUnauthorized()
  @ApiNotFound()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.service.findOne(id);
    return ProductResponseDto.from(product);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiUnauthorized()
  @ApiBadRequest()
  @ApiNotFound()
  @ApiConflict()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const updated = await this.service.update(id, dto);
    return ProductResponseDto.from(updated);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiUnauthorized()
  @ApiNotFound()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removed = await this.service.remove(id);
    return ProductResponseDto.from(removed);
  }
}
