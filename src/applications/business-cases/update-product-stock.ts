import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';

@Injectable()
export class UpdateProductStock {
  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  async execute(id: number, stock: number): Promise<void> {
    try {
      await this.product.update<ProductEntity>({ stock }, { where: { id } });
    } catch (error) {
      console.error('Failed to update product stock', error);
      throw new Error('Failed to update product stock');
    }
  }
}
