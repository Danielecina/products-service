// import { IsDecimal, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductDto {
  name: string;

  productToken: string;

  price: number;

  stock: number;
}
