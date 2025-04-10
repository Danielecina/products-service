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

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private updateProductStock: UpdateProductStock,
    private createProduct: CreateProduct,
    private deleteProduct: DeleteProduct,
    private getProducts: GetProducts,
  ) {}

  @Get()
  async findAll(@Query() query: GetProductsDto): Promise<ProductDto[]> {
    try {
      return await this.getProducts.execute(query);
    } catch (error) {
      this.logger.error('Error fetching products:', (error as Error)?.message);
      throw new HttpException(
        'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
          : 'Failed to update product stock';

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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create product';
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
        error instanceof Error ? error.message : 'Failed to delete product';

      if (errorMessage === DeleteProduct.ERROR_TYPE.PRODUCT_NOT_FOUND) {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
