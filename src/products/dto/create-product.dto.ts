import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Coca Cola 1.5L' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @ApiProperty({ example: 'cmlqvyfiz0000mgvk5j98sjd8' })
  @IsString()
  @MinLength(1)
  categoryId: string;
}
