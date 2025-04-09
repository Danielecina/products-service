import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../domains/entities/product.entity';
import { CreateProductDto } from '../../presentation/dto/create-product.dto';

@Injectable()
export class CreateProduct {
  constructor(
    @InjectModel(ProductEntity)
    private product: typeof ProductEntity,
  ) {}

  async execute(dto: CreateProductDto): Promise<void> {
    try {
      const productData = {
        name: dto.name,
        stock: dto.stock,
        productToken: dto.productToken,
        price: dto.price,
      };

      await this.product.create<ProductEntity>(productData);
    } catch (error) {
      console.error('Failed to create product', error);
      throw new Error('Failed to create product');
    }
  }
}
