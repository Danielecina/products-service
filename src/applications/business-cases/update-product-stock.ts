import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { ProductDto } from 'src/presentation/dto/product.dto';

const ERROR_TYPE = {
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_TO_UPDATE_NOT_FOUND: 'Product to update not found',
  PRODUCT_UPDATE_FAILED: 'Failed to update product stock',
  PRODUCT_RETRIEVE_AFTER_UPDATE_FAILED: 'Failed to retrieve product updated',
} as const;

@Injectable()
export class UpdateProductStock {
  private readonly logger = new Logger(UpdateProductStock.name);

  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  static ERROR_TYPE = ERROR_TYPE;

  async execute(id: number, stock: number): Promise<ProductDto> {
    let affectedCountResponse: number;
    try {
      const [affectedCount] = await this.product.update<ProductEntity>(
        { stock },
        { where: { id } },
      );
      affectedCountResponse = affectedCount;
    } catch (error) {
      this.logger.error(
        ERROR_TYPE.PRODUCT_UPDATE_FAILED,
        (error as Error)?.message,
      );
      throw new Error(ERROR_TYPE.PRODUCT_UPDATE_FAILED);
    }

    if (affectedCountResponse === 0) {
      this.logger.error(ERROR_TYPE.PRODUCT_TO_UPDATE_NOT_FOUND);
      throw new Error(ERROR_TYPE.PRODUCT_TO_UPDATE_NOT_FOUND);
    }

    let updatedProduct: ProductEntity | null;
    try {
      updatedProduct = await this.product.findOne<ProductEntity>({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        ERROR_TYPE.PRODUCT_RETRIEVE_AFTER_UPDATE_FAILED,
        (error as Error)?.message,
      );
      throw new Error(ERROR_TYPE.PRODUCT_RETRIEVE_AFTER_UPDATE_FAILED);
    }

    if (!updatedProduct) {
      this.logger.error(ERROR_TYPE.PRODUCT_NOT_FOUND);
      throw new Error(ERROR_TYPE.PRODUCT_NOT_FOUND);
    }

    return this.mapToResponseDto(updatedProduct.toJSON());
  }

  private mapToResponseDto(product: ProductEntity): ProductDto {
    return {
      id: product.id,
      productToken: product.productToken,
      name: product.name,
      stock: product.stock,
      price: product.price,
    };
  }
}
