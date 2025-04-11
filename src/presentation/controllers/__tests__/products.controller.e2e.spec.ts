import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { UpdateProductStock } from '../../../applications/business-cases/update-product-stock';
import { CreateProduct } from '../../../applications/business-cases/create-product';
import { DeleteProduct } from '../../../applications/business-cases/delete-product';
import { GetProducts } from '../../../applications/business-cases/get-products';
import { CreateProductDto } from '../../dto/create-product.dto';
import { ProductsController } from '../products.controller';

describe('Products Controller Integration Tests', () => {
  let app: INestApplication<App>;

  // Mock business cases
  const mockGetProducts = {
    execute: jest.fn().mockResolvedValue([
      { id: 1, name: 'Test Product 1', price: 100, stock: 10 },
      { id: 2, name: 'Test Product 2', price: 200, stock: 20 },
    ]),
  };

  const mockCreateProduct = {
    execute: jest.fn().mockImplementation((productData) => {
      return Promise.resolve({
        id: 1,
        ...productData,
      });
    }),
  };

  const mockUpdateProductStock = {
    execute: jest.fn().mockImplementation((id, stock: number) => {
      return Promise.resolve({
        id: Number(id),
        productToken: 'token123',
        name: 'Test Product',
        stock,
        price: 100,
      });
    }),
  };

  const mockDeleteProduct = {
    execute: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: GetProducts, useValue: mockGetProducts },
        { provide: CreateProduct, useValue: mockCreateProduct },
        { provide: UpdateProductStock, useValue: mockUpdateProductStock },
        { provide: DeleteProduct, useValue: mockDeleteProduct },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    test('200 - should return a list of products', async () => {
      const response = await request(app.getHttpServer()).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(mockGetProducts.execute).toHaveBeenCalled();
    });

    test('500', async () => {
      mockGetProducts.execute.mockRejectedValueOnce(
        new Error(GetProducts.ERROR_TYPE.PRODUCTS_RETRIEVE_FAILED),
      );
      const response = await request(app.getHttpServer()).get('/products');

      expect(response.body).toEqual({
        statusCode: 500,
        message: ProductsController.ERROR_TYPE.PRODUCTS_RETRIEVE_FAILED,
      });
      expect(mockGetProducts.execute).toHaveBeenCalled();
    });
  });

  describe('POST /products', () => {
    beforeEach(() => {
      mockCreateProduct.execute.mockReset();
    });

    test('200 - should create a new product', async () => {
      mockCreateProduct.execute.mockImplementation((productData) => {
        return Promise.resolve({
          id: 1,
          ...productData,
        });
      });

      const newProduct: CreateProductDto = {
        name: 'Test Product',
        productToken: 'token123',
        price: '100.00',
        stock: 10,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(newProduct);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        ...newProduct,
      });

      expect(mockCreateProduct.execute).toHaveBeenCalledWith(newProduct);
    });

    test('400 - should return invalid product data', async () => {
      mockCreateProduct.execute.mockRejectedValueOnce(
        new Error(CreateProduct.ERROR_TYPE.PRODUCT_CREATE_FAILED),
      );

      const invalidProduct: Partial<CreateProductDto> = {
        name: 'Test Product',
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(invalidProduct);

      expect(response.status).toBe(400);
    });

    test('500', async () => {
      mockCreateProduct.execute.mockRejectedValueOnce(
        new Error(CreateProduct.ERROR_TYPE.PRODUCT_CREATE_FAILED),
      );

      const newProduct: CreateProductDto = {
        name: 'Test Product',
        productToken: 'token123',
        price: '100.00',
        stock: 10,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(newProduct);

      expect(response.body).toEqual({
        statusCode: 500,
        message: ProductsController.ERROR_TYPE.PRODUCT_CREATE_FAILED,
      });
      expect(mockCreateProduct.execute).toHaveBeenCalled();
    });
  });

  describe('PATCH /products/:id/stock', () => {
    beforeEach(() => {
      mockUpdateProductStock.execute.mockReset();
    });

    it('200 - should update the stock of a product', async () => {
      const productId = 1;
      const updateStockDto = {
        stock: 50,
      };
      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .send(updateStockDto);

      expect(response.status).toBe(200);
      expect(mockUpdateProductStock.execute).toHaveBeenCalledWith(
        productId,
        updateStockDto.stock,
      );
    });

    it('404 - should return product is not found', async () => {
      const invalidId = 999;
      mockUpdateProductStock.execute.mockRejectedValueOnce(
        new Error(UpdateProductStock.ERROR_TYPE.PRODUCT_TO_UPDATE_NOT_FOUND),
      );

      const updateStockDto = {
        stock: 50,
      };

      const response = await request(app.getHttpServer())
        .patch(`/products/${invalidId}/stock`)
        .send(updateStockDto);

      expect(response.status).toBe(404);
    });

    it('400 - should return invalid stock data', async () => {
      const productId = 1;
      mockUpdateProductStock.execute.mockRejectedValueOnce(
        new Error('Invalid stock value'),
      );

      const invalidStockDto = {
        stock: -10,
      };

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .send(invalidStockDto);

      expect(response.status).toBe(400);
    });

    it('500', async () => {
      mockUpdateProductStock.execute.mockRejectedValueOnce(
        new Error(UpdateProductStock.ERROR_TYPE.PRODUCT_UPDATE_FAILED),
      );

      const productId = 1;
      const updateStockDto = {
        stock: 50,
      };

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .send(updateStockDto);

      expect(response.body).toEqual({
        statusCode: 500,
        message: ProductsController.ERROR_TYPE.PRODUCT_STOCK_UPDATE_FAILED,
      });
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product by ID', async () => {
      const productId = 123;
      const response = await request(app.getHttpServer()).delete(
        `/products/${productId}`,
      );

      expect(response.status).toBe(204);
      expect(mockDeleteProduct.execute).toHaveBeenCalledWith(productId);
    });

    it('should return 404 if the product is not found', async () => {
      const invalidId = 'nonexistent-id';
      mockDeleteProduct.execute.mockRejectedValueOnce(
        new Error(DeleteProduct.ERROR_TYPE.PRODUCT_NOT_FOUND),
      );

      const response = await request(app.getHttpServer()).delete(
        `/products/${invalidId}`,
      );

      expect(response.status).toBe(404);
    });
  });
});
