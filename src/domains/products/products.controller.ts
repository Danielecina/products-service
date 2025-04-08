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

import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { ProductsService } from './products.service';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // TODO: paginare i prodotti
  @Get()
  async findAll(@Query() query: Que): Promise<Product[]> {
    try {
      return await this.productsService.findAll();
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
  async update(
    @Param('id') id: number,
    @Body() body: UpdateProductStockDto,
  ): Promise<Product> {
    return await this.productsService.update(id, body);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateProductDto): Promise<Product> {
    // TODO: capire se deve tornare 201 o 200...
    return await this.productsService.create(body);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() id: number): Promise<void> {
    await this.productsService.delete(id);
  }
}
