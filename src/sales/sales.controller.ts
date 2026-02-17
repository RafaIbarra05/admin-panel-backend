import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private service: SalesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.service.create(dto);
  }
}
