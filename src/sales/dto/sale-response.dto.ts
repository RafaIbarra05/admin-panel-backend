export class SaleItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;

  product: {
    id: string;
    name: string;
  };
}

export class SaleResponseDto {
  id: string;
  createdAt: Date;
  total: string;
  items: SaleItemResponseDto[];
}
