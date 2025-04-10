import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../../domains/entities/product.entity';
import { DeleteProduct } from '../delete-product';

describe('CreateProduct', () => {
  let deleteProduct: DeleteProduct;
  const ProductEntityMock = {
    provide: getModelToken(ProductEntity),
    useValue: {
      destroy: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [DeleteProduct, ProductEntityMock],
    }).compile();

    deleteProduct = module.get<DeleteProduct>(DeleteProduct);
  });

  test('should create a product successfully', async () => {
    await deleteProduct.execute(1);

    expect(ProductEntityMock.useValue.destroy).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  test('should fails create for an error', async () => {
    ProductEntityMock.useValue.destroy.mockRejectedValue(
      new Error('Database error message'),
    );

    await expect(deleteProduct.execute(1)).rejects.toThrow(
      'Failed to delete product',
    );
  });
});
