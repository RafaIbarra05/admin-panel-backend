import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export const categoryWithRelationsArgs =
  Prisma.validator<Prisma.CategoryDefaultArgs>()({
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { children: true, products: true } },
    },
  });

export type CategoryWithRelations = Prisma.CategoryGetPayload<
  typeof categoryWithRelationsArgs
>;

export class CategoryResponseDto {
  @ApiProperty({ example: 'cmlqvyfiz0000mgvk5j98sjd8' })
  id: string;

  @ApiProperty({ example: 'Bebidas' })
  name: string;

  @ApiProperty({ example: 0 })
  position: number;

  @ApiProperty({ example: null, nullable: true })
  parentId: string | null;

  @ApiProperty({
    example: { id: 'cmlparent0001', name: 'Principal' },
    nullable: true,
  })
  parent: { id: string; name: string } | null;

  @ApiProperty({ example: 3 })
  childrenCount: number;

  @ApiProperty({ example: 5 })
  productsCount: number;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  updatedAt: string;

  static from(model: CategoryWithRelations): CategoryResponseDto {
    return {
      id: model.id,
      name: model.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      position: model.position,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parentId: model.parentId,
      parent: model.parent,
      childrenCount: model._count.children,
      productsCount: model._count.products,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    };
  }
}
