import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductEntity } from './product.entity';
import { PRODUCTS_REPOSITORY } from './product.providers';
import { Product } from './interfaces/product.interface';

const ERROR_FAILED_TO_UPDATE_PRODUCT = 'Failed to update product';
const ERROR_FAILED_TO_FETCH_UPDATED_PRODUCT = 'Failed to fetch updated product';
const ERROR_FAILED_TO_FIND_PRODUCT = 'Failed to find product';
const ERROR_FAILED_TO_FIND_PRODUCTS = 'Failed to find products';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private productsRepository: typeof ProductEntity,
  ) {}

  // TODO: paginare i prodotti
  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productsRepository.findAll<ProductEntity>();
      return products.map(
        (product: ProductEntity): Product => ({
          id: product.Id,
          stock: product.stock,
          productToken: product.productToken,
          name: product.name,
          price: product.price,
        }),
      );
    } catch (error) {
      console.error(ERROR_FAILED_TO_FIND_PRODUCTS, error);
      throw new Error(ERROR_FAILED_TO_FIND_PRODUCTS);
    }
  }

  async update(id: number, product: Partial<ProductEntity>): Promise<Product> {
    try {
      await this.productsRepository.update<ProductEntity>(product, {
        where: { id },
      });
    } catch (error) {
      console.error(ERROR_FAILED_TO_UPDATE_PRODUCT, error);
      throw new Error(ERROR_FAILED_TO_UPDATE_PRODUCT);
    }

    let updatedProduct: ProductEntity | null = null;
    try {
      updatedProduct = await this.productsRepository.findOne<ProductEntity>({
        where: { id },
      });
    } catch (error) {
      console.error(ERROR_FAILED_TO_FETCH_UPDATED_PRODUCT, error);
      throw new Error(ERROR_FAILED_TO_FETCH_UPDATED_PRODUCT);
    }

    if (!updatedProduct) {
      throw new Error(ERROR_FAILED_TO_FIND_PRODUCT);
    }

    return {
      id: updatedProduct.Id,
      stock: updatedProduct?.stock,
      productToken: updatedProduct?.productToken,
      name: updatedProduct?.name,
      price: updatedProduct?.price,
    };
  }

  async create(product: Partial<ProductEntity>): Promise<ProductEntity> {
    return await this.productsRepository.create<ProductEntity>(product);
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.destroy({
      where: { id },
    });
  }
}
