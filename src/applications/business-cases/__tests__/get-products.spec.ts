import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../../domains/entities/product.entity';
import { GetProducts } from '../get-products';
import { ProductDto } from 'src/presentation/dto/product.dto';

const mockProductData: ProductDto = {
  id: 1,
  name: 'Test Product',
  productToken: 'test-product-token',
  price: 100.0,
  stock: 10,
};

describe('CreateProduct', () => {
  let getProducts: GetProducts;

  const ProductEntityMock = {
    provide: getModelToken(ProductEntity),
    useValue: {
      findAll: jest.fn().mockImplementation(() => {
        const mockToJson = (id: number) => (): ProductDto => ({
          ...mockProductData,
          id,
        });

        return Promise.resolve([
          { ...mockProductData, id: 1, toJSON: mockToJson(1) },
          { ...mockProductData, id: 2, toJSON: mockToJson(2) },
        ]);
      }),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [GetProducts, ProductEntityMock],
    }).compile();

    getProducts = module.get<GetProducts>(GetProducts);
  });

  test('should retrieve products successfully', async () => {
    const products = await getProducts.execute({ page: 1, perPage: 10 });

    expect(ProductEntityMock.useValue.findAll).toHaveBeenCalledWith({
      offset: 0,
      limit: 10,
    });

    expect(products).toEqual([
      { ...mockProductData, id: 1 },
      { ...mockProductData, id: 2 },
    ]);
  });

  test('should fails create for an error', async () => {
    ProductEntityMock.useValue.findAll.mockRejectedValue(
      new Error('Database error message'),
    );

    await expect(getProducts.execute({ page: 1, perPage: 10 })).rejects.toThrow(
      'Failed to retrieve products',
    );
  });
});
