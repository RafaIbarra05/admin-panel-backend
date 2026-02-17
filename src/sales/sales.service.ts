import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async create(dto: CreateSaleDto) {
    if (!dto.items?.length) {
      throw new BadRequestException('items must not be empty');
    }

    // 0) Normalizar items: agrupar por productId y sumar quantities
    const merged = new Map<string, number>();
    for (const item of dto.items) {
      merged.set(
        item.productId,
        (merged.get(item.productId) ?? 0) + item.quantity,
      );
    }

    const normalizedItems = Array.from(merged.entries()).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      }),
    );

    // 1) Traer productos y validar que existan
    const productIds = normalizedItems.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const foundIds = new Set(products.map((p) => p.id));
    const missing = productIds.filter((id) => !foundIds.has(id));
    if (missing.length) {
      throw new BadRequestException({
        message: 'One or more products do not exist',
        missingProductIds: missing,
      });
    }

    const productById = new Map(products.map((p) => [p.id, p]));

    // 2) Calcular total (unitPrice = precio actual del producto)
    const total = normalizedItems.reduce((acc, item) => {
      const product = productById.get(item.productId)!;
      return acc + Number(product.price) * item.quantity;
    }, 0);

    // 3) Transacción: crear sale + items
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: { total },
      });

      await tx.saleItem.createMany({
        data: normalizedItems.map((item) => {
          const product = productById.get(item.productId)!;
          return {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
          };
        }),
      });

      return tx.sale.findUnique({
        where: { id: sale.id },
        include: { items: { include: { product: true } } },
      });
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!sale) throw new NotFoundException('Sale not found');

    return sale;
  }
}
