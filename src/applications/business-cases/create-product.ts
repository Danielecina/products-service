import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { CreateProductDto } from '../../presentation/dto/create-product.dto';
import { ProductDto } from 'src/presentation/dto/product.dto';

@Injectable()
export class CreateProduct {
  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

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
      console.error('Failed to create product', error);
      throw new Error('Failed to create product');
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
