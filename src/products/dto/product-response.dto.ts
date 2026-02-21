import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: { select: { id: true; name: true } } };
}>;

export class ProductResponseDto {
  @ApiProperty({ example: 'cmlqvyfiz0000mgvk5j98sjd8' })
  id: string;

  @ApiProperty({ example: 'Coca Cola 1.5L' })
  name: string;

  @ApiProperty({ example: '1500.00', description: 'Decimal as string' })
  price: string;

  @ApiProperty({ example: 0 })
  position: number;

  @ApiProperty({ example: 'cmlqxu2ld0000bcvk1770dopw' })
  categoryId: string;

  @ApiProperty({
    example: { id: 'cmlqxu2ld0000bcvk1770dopw', name: 'Bebidas' },
  })
  category: { id: string; name: string };

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  updatedAt: string;

  static from(model: ProductWithCategory): ProductResponseDto {
    return {
      id: model.id,
      name: model.name,
      price: model.price.toString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      position: model.position,
      categoryId: model.categoryId,
      category: model.category,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    };
  }
}
