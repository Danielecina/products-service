import { IsInt, Min } from 'class-validator';

export class GetProductsDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  perPage: number = 10;
}
