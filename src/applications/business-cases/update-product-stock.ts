import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { ProductDto } from 'src/presentation/dto/product.dto';

@Injectable()
export class UpdateProductStock {
  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  async execute(id: number, stock: number): Promise<ProductDto> {
    try {
      await this.product.update<ProductEntity>({ stock }, { where: { id } });
      const updatedProduct = await this.product.findOne<ProductEntity>({
        where: { id },
      });

      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      return this.mapToResponseDto(updatedProduct.toJSON());
    } catch (error) {
      console.error('Failed to update product stock', error);
      throw new Error('Failed to update product stock');
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
