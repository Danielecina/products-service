import { PickType } from '@nestjs/mapped-types';

import { ProductDto } from './product.dto';

export class UpdateProductStockDto extends PickType(ProductDto, ['stock']) {}
