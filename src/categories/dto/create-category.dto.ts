import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bebidas', minLength: 1 })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: 'cmlparent0001',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
