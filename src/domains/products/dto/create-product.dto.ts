import { IsDecimal, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  productToken: string;

  @IsDecimal()
  price: number;

  @IsInt()
  stock: number;
}
