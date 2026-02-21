import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryResponseDto,
  CategoryWithRelations,
  categoryWithRelationsArgs,
} from './dto/category-response.dto';
import { Prisma } from '@prisma/client';
type CategoryCountPayload = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    _count: { select: { children: true; products: true } };
  };
}>;
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories: CategoryWithRelations[] =
      await this.prisma.category.findMany({
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { children: true, products: true } },
        },
      });

    return categories.map((c) => CategoryResponseDto.from(c));
  }
  async create(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    const position = dto.position ?? 0;
    const parentId = dto.parentId ?? null;

    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
        select: { id: true },
      });
      if (!parent) throw new BadRequestException('Parent category not found');
    }

    return this.prisma.category.create({
      data: {
        name,
        position,
        parentId,
      },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true, products: true } },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      ...categoryWithRelationsArgs,
    });

    if (!category) throw new NotFoundException('Category not found');

    return CategoryResponseDto.from(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    const data: Record<string, any> = {};

    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.position !== undefined) data.position = dto.position;

    // parentId puede venir como string, null o undefined
    if (dto.parentId !== undefined) {
      if (dto.parentId === null || dto.parentId === '') {
        data.parentId = null;
      } else {
        // evita self-parent
        if (dto.parentId === id) {
          throw new BadRequestException('A category cannot be its own parent');
        }

        const parent = await this.prisma.category.findUnique({
          where: { id: dto.parentId },
          select: { id: true },
        });
        if (!parent) throw new BadRequestException('Parent category not found');

        data.parentId = dto.parentId;
      }
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const category: CategoryCountPayload | null =
      await this.prisma.category.findUnique({
        where: { id },
        select: {
          id: true,
          _count: {
            select: {
              children: true,
              products: true,
            },
          },
        },
      });

    if (!category) throw new NotFoundException('Category not found');

    if (category._count.children > 0) {
      throw new BadRequestException(
        'No se puede eliminar una categoría con subcategorías.',
      );
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        'No se puede eliminar una categoría con productos asociados.',
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { ok: true };
  }
}
