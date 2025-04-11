import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../../domains/entities/product.entity';
import { UpdateProductStock } from '../update-product-stock';
import { ProductDto } from 'src/presentation/dto/product.dto';

describe('UpdateProductStock', () => {
  let updateProduct: UpdateProductStock;
  const updatedProduct: ProductDto = {
    id: 1,
    productToken: 'test-product-token',
    name: 'Test Product',
    price: '100.0',
    stock: 10,
  };

  let ProductEntityMock: {
    provide: string;
    useValue: {
      findOne: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    ProductEntityMock = {
      provide: getModelToken(ProductEntity),
      useValue: {
        findOne: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            ...updatedProduct,
            toJSON: jest.fn().mockReturnValue(updatedProduct),
          });
        }),
        update: jest.fn().mockReturnValue([1]),
      },
    };

    const module = await Test.createTestingModule({
      providers: [UpdateProductStock, ProductEntityMock],
    }).compile();

    updateProduct = module.get<UpdateProductStock>(UpdateProductStock);
  });

  test('should create a product successfully', async () => {
    ProductEntityMock.useValue.findOne.mockResolvedValue({
      ...updatedProduct,
      toJSON: jest.fn().mockReturnValue(updatedProduct),
    });

    const result = await updateProduct.execute(1, 10);

    expect(ProductEntityMock.useValue.update).toHaveBeenCalledWith(
      { stock: 10 },
      { where: { id: 1 } },
    );

    expect(ProductEntityMock.useValue.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result).toEqual(updatedProduct);
  });

  test('should fails update for an error', async () => {
    ProductEntityMock.useValue.update.mockRejectedValue(
      new Error('Database error message'),
    );

    await expect(updateProduct.execute(1, 10)).rejects.toThrow(
      UpdateProductStock.ERROR_TYPE.PRODUCT_UPDATE_FAILED,
    );
  });

  test('expect correct error when findOne not found the product updated', async () => {
    ProductEntityMock.useValue.findOne.mockRejectedValue(
      UpdateProductStock.ERROR_TYPE.PRODUCT_RETRIEVE_AFTER_UPDATE_FAILED,
    );

    await expect(updateProduct.execute(1, 10)).rejects.toThrow(
      UpdateProductStock.ERROR_TYPE.PRODUCT_RETRIEVE_AFTER_UPDATE_FAILED,
    );
  });
});
