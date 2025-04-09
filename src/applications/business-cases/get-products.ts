import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { GetProductsDto } from 'src/presentation/dto/get-products.dto';

@Injectable()
export class GetProducts {
  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  async execute({ page, perPage }: GetProductsDto): Promise<void> {
    try {
      await this.product.findAll<ProductEntity>({
        offset: (page - 1) * perPage,
        limit: perPage,
      });
    } catch (error) {
      console.error('Failed to retrieve products', error);
      throw new Error('Failed to retrieve products');
    }
  }
}
