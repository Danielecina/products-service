import { ProductDto } from './product.dto';
import { PickType } from '@nestjs/mapped-types';

export class CreateProductDto extends PickType(ProductDto, [
  'name',
  'productToken',
  'price',
  'stock',
]) {}
