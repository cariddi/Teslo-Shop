import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // same as enableImpoicitConversions: true
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) // same as enableImpoicitConversions: true
  offset?: number;
}
