import { ApiProperty } from '@nestjs/swagger';
import { SaleResponseDto } from './sale-response.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 10 }) limit: number;
  @ApiProperty({ example: 35 }) total: number;
  @ApiProperty({ example: 4 }) totalPages: number;
}

export class PaginatedSalesResponseDto {
  @ApiProperty({ type: [SaleResponseDto] })
  data: SaleResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
