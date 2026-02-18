import { ApiProperty } from '@nestjs/swagger';

export class SaleItemResponseDto {
  @ApiProperty({ example: 'cml...' })
  id: string;

  @ApiProperty({ example: 'cml...' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: '1500.00', description: 'Decimal as string' })
  unitPrice: string;

  @ApiProperty({
    example: { id: 'cml...', name: 'Coca Cola 1.5L' },
  })
  product: { id: string; name: string };
}

export class SaleResponseDto {
  @ApiProperty({ example: 'cml...' })
  id: string;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  createdAt: string; // 👈 mejor que Date

  @ApiProperty({ example: '3000.00', description: 'Decimal as string' })
  total: string;

  @ApiProperty({ type: [SaleItemResponseDto] })
  items: SaleItemResponseDto[];
}
