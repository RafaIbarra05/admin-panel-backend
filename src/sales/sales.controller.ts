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

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private service: SalesService) {}

  @Get()
  findAll(@Query() query: SalesQueryDto) {
    return this.service.findAll(query.page, query.limit);
  }

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
