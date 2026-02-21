import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
