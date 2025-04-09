import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';

@Injectable()
export class DeleteProduct {
  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  async execute(id: number): Promise<void> {
    try {
      await this.product.destroy<ProductEntity>({ where: { id } });
    } catch (error) {
      console.error('Failed to delete product', error);
      throw new Error('Failed to delete product');
    }
  }
}
