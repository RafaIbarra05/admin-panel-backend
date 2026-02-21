import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ProductResponseDto,
  ProductWithCategory,
} from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const safePage = Number.isFinite(page) && page >= 1 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit >= 1 && limit <= 100 ? limit : 10;

    const skip = (safePage - 1) * safeLimit;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.product.count(),
      this.prisma.product.findMany({
        skip,
        take: safeLimit,
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        include: { category: { select: { id: true, name: true } } },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      data: (rows as ProductWithCategory[]).map((row) =>
        ProductResponseDto.from(row),
      ),
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
      select: { id: true },
    });
    if (!category) throw new BadRequestException('categoryId does not exist');

    return this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        price: dto.price,
        position: dto.position ?? 0,
        categoryId: dto.categoryId,
      },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
        select: { id: true },
      });
      if (!category) throw new BadRequestException('categoryId does not exist');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.position !== undefined ? { position: dto.position } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
  }
}
