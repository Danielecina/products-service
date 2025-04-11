import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { GetProductsDto } from '../../presentation/dto/get-products.dto';
import { ProductDto } from 'src/presentation/dto/product.dto';

const ERROR_TYPE = {
  PRODUCTS_RETRIEVE_FAILED: 'Failed to retrieve products',
} as const;

@Injectable()
export class GetProducts {
  private readonly logger = new Logger(GetProducts.name);

  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  static ERROR_TYPE = ERROR_TYPE;

  async execute({ page, perPage }: GetProductsDto): Promise<ProductDto[]> {
    try {
      const products = await this.product.findAll<ProductEntity>({
        offset: (page - 1) * perPage,
        limit: perPage,
      });

      this.logger.debug(
        { itemsLenght: products?.length },
        'retrieved products',
      );

      return products.map((product) => this.mapToResponseDto(product.toJSON()));
    } catch (error) {
      this.logger.error(
        ERROR_TYPE.PRODUCTS_RETRIEVE_FAILED,
        (error as Error)?.message,
      );
      throw new Error(ERROR_TYPE.PRODUCTS_RETRIEVE_FAILED);
    }
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
