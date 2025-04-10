import {
  IsNotEmpty,
  IsString,
  IsDecimal,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';

export class ProductDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  productToken: string;

  @IsDecimal()
  @IsNotEmpty()
  price: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  stock: number;
}
