import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { CreateProductDto } from '../../presentation/dto/create-product.dto';
import { ProductDto } from 'src/presentation/dto/product.dto';

const ERROR_TYPE = {
  PRODUCT_CREATE_FAILED: 'Failed to create product',
} as const;

@Injectable()
export class CreateProduct {
  private readonly logger = new Logger(CreateProduct.name);

  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  static ERROR_TYPE = ERROR_TYPE;

  async execute(dto: CreateProductDto): Promise<ProductDto> {
    try {
      const productData = {
        name: dto.name,
        stock: dto.stock,
        productToken: dto.productToken,
        price: dto.price,
      };

      const createdProduct =
        await this.product.create<ProductEntity>(productData);

      return this.mapToResponseDto(createdProduct.toJSON());
    } catch (error) {
      this.logger.error(
        ERROR_TYPE.PRODUCT_CREATE_FAILED,
        (error as Error)?.message,
      );
      throw new Error(ERROR_TYPE.PRODUCT_CREATE_FAILED);
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
