import { SaleResponseDto } from './sale-response.dto';

export class PaginatedSalesResponseDto {
  data: SaleResponseDto[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
