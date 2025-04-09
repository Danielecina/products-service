import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { GetProductsDto } from '../../presentation/dto/get-products.dto';
import { ProductDto } from 'src/presentation/dto/product.dto';

@Injectable()
export class GetProducts {
  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  async execute({ page, perPage }: GetProductsDto): Promise<ProductDto[]> {
    try {
      const products = await this.product.findAll<ProductEntity>({
        offset: (page - 1) * perPage,
        limit: perPage,
      });
      return products.map((product) => this.mapToResponseDto(product.toJSON()));
    } catch (error) {
      console.error('Failed to retrieve products', error);
      throw new Error('Failed to retrieve products');
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
