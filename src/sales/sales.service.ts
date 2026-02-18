import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { PaginatedSalesResponseDto } from './dto/paginated-sales-response.dto';

type PrismaSale = {
  id: string;
  createdAt: Date;
  total: { toString(): string };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: { toString(): string };
    product: { id: string; name: string };
  }>;
};

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  // Mapper: Prisma -> DTO (Decimal -> string)
  private toSaleResponseDto(sale: PrismaSale): SaleResponseDto {
    return {
      id: sale.id,
      createdAt: sale.createdAt,
      total: sale.total.toString(),
      items: sale.items.map((it) => ({
        id: it.id,
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.unitPrice.toString(),
        product: {
          id: it.product.id,
          name: it.product.name,
        },
      })),
    };
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedSalesResponseDto> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.sale.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              unitPrice: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.sale.count(),
    ]);

    return {
      data: (data as unknown as PrismaSale[]).map((s) =>
        this.toSaleResponseDto(s),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateSaleDto): Promise<SaleResponseDto> {
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
    const created = await this.prisma.$transaction(async (tx) => {
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
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              unitPrice: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    // created puede ser null teóricamente, pero por flujo no debería.
    return this.toSaleResponseDto(created as unknown as PrismaSale);
  }

  async findOne(id: string): Promise<SaleResponseDto> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            unitPrice: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!sale) throw new NotFoundException('Sale not found');

    return this.toSaleResponseDto(sale as unknown as PrismaSale);
  }
}
