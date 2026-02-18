import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';

export class CategoryResponseDto {
  @ApiProperty({ example: 'cmlqvyfiz0000mgvk5j98sjd8' })
  id: string;

  @ApiProperty({ example: 'Bebidas' })
  name: string;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-02-17T17:37:14.267Z' })
  updatedAt: string;

  static from(model: Category): CategoryResponseDto {
    return {
      id: model.id,
      name: model.name,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    };
  }
}
