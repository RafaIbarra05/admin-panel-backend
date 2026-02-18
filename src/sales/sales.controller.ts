import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesQueryDto } from './dto/sales-query.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { PaginatedSalesResponseDto } from './dto/paginated-sales-response.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiBadRequest,
  ApiNotFound,
  ApiUnauthorized,
} from 'src/common/docs/swagger.decorators';
@ApiTags('sales')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private service: SalesService) {}

  @ApiOperation({ summary: 'List sales (paginated)' })
  @ApiOkResponse({ type: PaginatedSalesResponseDto })
  @ApiUnauthorized()
  @ApiBadRequest()
  @Get()
  findAll(@Query() query: SalesQueryDto): Promise<PaginatedSalesResponseDto> {
    return this.service.findAll(query.page, query.limit);
  }

  @ApiOperation({ summary: 'Create sale' })
  @ApiCreatedResponse({ type: SaleResponseDto })
  @ApiUnauthorized()
  @ApiBadRequest()
  @Post()
  create(@Body() dto: CreateSaleDto): Promise<SaleResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Get sale by id' })
  @ApiOkResponse({ type: SaleResponseDto })
  @ApiUnauthorized()
  @ApiNotFound()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<SaleResponseDto> {
    return this.service.findOne(id);
  }
}
