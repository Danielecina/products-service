import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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

@Controller('products')
export class ProductsController {
  constructor(
    private updateProductStock: UpdateProductStock,
    private createProduct: CreateProduct,
    private deleteProduct: DeleteProduct,
    private getProducts: GetProducts,
  ) {}

  @Get()
  async findAll(@Query() query: GetProductsDto) {
    try {
      return await this.getProducts.execute(query);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new HttpException(
        'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/stock')
  @HttpCode(200)
  async update(@Param('id') id: number, @Body() body: UpdateProductStockDto) {
    try {
      return await this.updateProductStock.execute(id, body.stock);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update product stock';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateProductDto) {
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
  async delete(@Param() id: number) {
    try {
      return await this.deleteProduct.execute(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create product';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
