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

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private service: SalesService) {}

  @Get()
  findAll(@Query() query: SalesQueryDto): Promise<PaginatedSalesResponseDto> {
    return this.service.findAll(query.page, query.limit);
  }

  @Post()
  create(@Body() dto: CreateSaleDto): Promise<SaleResponseDto> {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SaleResponseDto> {
    return this.service.findOne(id);
  }
}
