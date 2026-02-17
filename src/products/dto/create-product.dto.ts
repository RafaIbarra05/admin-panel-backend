import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsString()
  @MinLength(1)
  categoryId: string;
}
