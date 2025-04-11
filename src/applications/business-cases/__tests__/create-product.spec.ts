import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { Product as ProductEntity } from '../../../domains/entities/product.entity';
import { CreateProductDto } from '../../../presentation/dto/create-product.dto';
import { CreateProduct } from '../create-product';

describe('CreateProduct', () => {
  let createProduct: CreateProduct;

  const ProductEntityMock = {
    provide: getModelToken(ProductEntity),
    useValue: {
      create: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          id: 1,
          ...data,
          toJSON: jest.fn().mockReturnValue({ id: 1, ...data }),
        });
      }),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [CreateProduct, ProductEntityMock],
    }).compile();

    createProduct = module.get<CreateProduct>(CreateProduct);
  });

  test('should create a product successfully', async () => {
    const mockProductData: CreateProductDto = {
      name: 'Test Product',
      productToken: 'test-product-token',
      price: '100.0',
      stock: 10,
    };

    const result = await createProduct.execute(mockProductData);

    expect(ProductEntityMock.useValue.create).toHaveBeenCalledWith({
      name: mockProductData.name,
      stock: mockProductData.stock,
      productToken: mockProductData.productToken,
      price: mockProductData.price,
    });

    expect(result).toEqual({
      id: 1,
      productToken: mockProductData.productToken,
      name: mockProductData.name,
      stock: mockProductData.stock,
      price: mockProductData.price,
    });
  });

  test('should fails create for an error', async () => {
    const mockProductData: CreateProductDto = {
      name: 'Test Product',
      productToken: 'test-product-token',
      price: '100.0',
      stock: 10,
    };

    ProductEntityMock.useValue.create.mockRejectedValue(
      new Error('Database error message'),
    );

    await expect(createProduct.execute(mockProductData)).rejects.toThrow(
      'Failed to create product',
    );
  });
});
