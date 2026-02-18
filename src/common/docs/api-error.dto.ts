import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Database error' })
  message: string;

  @ApiPropertyOptional({ example: 'P2002' })
  code?: string;

  @ApiPropertyOptional({
    example: { target: ['Category_name_key'] },
    description: 'Prisma error metadata (when available)',
  })
  meta?: any;
}
