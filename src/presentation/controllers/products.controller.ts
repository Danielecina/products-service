import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UpdateProductStockDto } from '../dto/update-product-stock.dto';
import { UpdateProductStock } from '../../applications/business-cases/update-product-stock';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateProduct } from '../../applications/business-cases/create-product';
import { DeleteProduct } from '../../applications/business-cases/delete-product';
import { GetProductsDto } from '../dto/get-products.dto';
import { GetProducts } from '../../applications/business-cases/get-products';
import { ProductDto } from '../dto/product.dto';

const ERROR_TYPE = {
  PRODUCTS_RETRIEVE_FAILED: 'Failed to retrieve products',
  PRODUCT_CREATE_FAILED: 'Failed to create product',
  PRODUCT_DELETE_FAILED: 'Failed to delete product',
  PRODUCT_STOCK_UPDATE_FAILED: 'Failed to update product stock',
} as const;

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private updateProductStock: UpdateProductStock,
    private createProduct: CreateProduct,
    private deleteProduct: DeleteProduct,
    private getProducts: GetProducts,
  ) {}

  static ERROR_TYPE = ERROR_TYPE;

  @Get()
  async findAll(@Query() query: GetProductsDto): Promise<ProductDto[]> {
    try {
      return await this.getProducts.execute(query);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_TYPE.PRODUCTS_RETRIEVE_FAILED;

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/stock')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateProductStockDto,
  ): Promise<ProductDto> {
    try {
      return await this.updateProductStock.execute(id, body.stock);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_TYPE.PRODUCT_STOCK_UPDATE_FAILED;

      if (
        errorMessage ===
        UpdateProductStock.ERROR_TYPE.PRODUCT_TO_UPDATE_NOT_FOUND
      ) {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: CreateProductDto): Promise<ProductDto> {
    try {
      return await this.createProduct.execute(body);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_TYPE.PRODUCT_CREATE_FAILED;

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<void> {
    try {
      return await this.deleteProduct.execute(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_TYPE.PRODUCT_DELETE_FAILED;

      if (errorMessage === DeleteProduct.ERROR_TYPE.PRODUCT_NOT_FOUND) {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
