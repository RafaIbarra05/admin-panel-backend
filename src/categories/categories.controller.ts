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
  findAll() {
    return this.service.findAll();
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
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiUnauthorized()
  @ApiBadRequest()
  @ApiNotFound()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
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
