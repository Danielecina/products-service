import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';

const ERROR_TYPE = {
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_DELETE_FAILED: 'Failed to delete product',
} as const;

@Injectable()
export class DeleteProduct {
  private readonly logger = new Logger(DeleteProduct.name);

  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  static ERROR_TYPE = ERROR_TYPE;

  async execute(id: number): Promise<void> {
    let deletedProduct: number;
    try {
      deletedProduct = await this.product.destroy<ProductEntity>({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        ERROR_TYPE.PRODUCT_DELETE_FAILED,
        (error as Error)?.message,
      );
      throw new Error(ERROR_TYPE.PRODUCT_DELETE_FAILED);
    }

    if (deletedProduct === null) {
      this.logger.error(ERROR_TYPE.PRODUCT_NOT_FOUND);
      throw new Error(ERROR_TYPE.PRODUCT_NOT_FOUND);
    }
  }
}
