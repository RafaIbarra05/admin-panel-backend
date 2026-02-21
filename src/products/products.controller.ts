import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedProductsResponseDto } from './dto/paginated-products-response.dto';
@ApiTags('products')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @ApiOperation({ summary: 'List products (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ type: PaginatedProductsResponseDto })
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const p = page ? Number(page) : 1;
    const l = limit ? Number(limit) : 10;
    return this.service.findAll(p, l);
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
  @ApiNoContentResponse()
  @ApiUnauthorized()
  @ApiNotFound()
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
