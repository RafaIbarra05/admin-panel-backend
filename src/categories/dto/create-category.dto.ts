import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bebidas', minLength: 1 })
  @IsString()
  @MinLength(1)
  name: string;
}
