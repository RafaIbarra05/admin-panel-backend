import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './category-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

export class PaginatedCategoriesResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
