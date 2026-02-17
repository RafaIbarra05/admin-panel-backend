import { BadRequestException, Injectable } from '@nestjs/common';
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

    // 1) Traer productos y validar que existan
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== new Set(productIds).size) {
      throw new BadRequestException('One or more products do not exist');
    }

    const productById = new Map(products.map((p) => [p.id, p]));

    // 2) Calcular total (unitPrice = precio actual del producto)
    const total = dto.items.reduce((acc, item) => {
      const product = productById.get(item.productId)!;
      return acc + Number(product.price) * item.quantity;
    }, 0);

    // 3) Transacción: crear sale + items
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: { total },
      });

      await tx.saleItem.createMany({
        data: dto.items.map((item) => {
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
}
