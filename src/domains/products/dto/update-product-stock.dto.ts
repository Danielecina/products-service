import { PickType } from '@nestjs/mapped-types';

import { CreateProductDto } from './create-product.dto';

export class UpdateProductStockDto extends PickType(CreateProductDto, [
  'stock',
]) {}
