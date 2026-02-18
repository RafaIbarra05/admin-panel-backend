import { ApiProperty } from '@nestjs/swagger';
import { Product, Category } from '@prisma/client';

export class ProductResponseDto {
  @ApiProperty({ example: 'cmlqvyfiz0000mgvk5j98sjd8' })
  id: string;

  @ApiProperty({ example: 'Coca Cola 1.5L' })
  name: string;

  @ApiProperty({
    example: '1500.00',
    description: 'Decimal as string',
  })
  price: string;

  @ApiProperty({ example: 'cmlqvyfiz0000mgvk5j98sjd8' })
  categoryId: string;

  @ApiProperty({ example: 'Bebidas' })
  categoryName: string;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  updatedAt: string;

  static from(model: Product & { category?: Category }) {
    return {
      id: model.id,
      name: model.name,
      price: model.price.toString(),
      categoryId: model.categoryId,
      categoryName: model.category?.name ?? '',
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    };
  }
}
