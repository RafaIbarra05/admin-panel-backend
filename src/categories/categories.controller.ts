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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiBadRequest,
  ApiNotFound,
  ApiUnauthorized,
} from 'src/common/docs/swagger.decorators';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('categories')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @ApiOperation({ summary: 'List categories' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  @ApiUnauthorized()
  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return data.map((c) => CategoryResponseDto.from(c));
  }
  @ApiOperation({ summary: 'Create category' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @ApiUnauthorized()
  @ApiBadRequest()
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.service.create(dto);
    return CategoryResponseDto.from(category);
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiUnauthorized()
  @ApiNotFound()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.service.findOne(id);
    return CategoryResponseDto.from(category);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiUnauthorized()
  @ApiBadRequest()
  @ApiNotFound()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.service.update(id, dto);
    return CategoryResponseDto.from(category);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiNoContentResponse()
  @ApiUnauthorized()
  @ApiNotFound()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
