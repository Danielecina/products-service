import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// databases
import { DatabaseModule } from './infrastructure/databases/database.module';

// controllers
import { ProductsController } from './presentation/controllers/products.controller';

// business cases
import { UpdateProductStock } from './applications/business-cases/update-product-stock';
import { CreateProduct } from './applications/business-cases/create-product';
import { DeleteProduct } from './applications/business-cases/delete-product';
import { GetProducts } from './applications/business-cases/get-products';

@Module({
  imports: [
    // configurations microservice modules
    ConfigModule.forRoot(),

    // database module
    DatabaseModule,
  ],
  providers: [UpdateProductStock, CreateProduct, DeleteProduct, GetProducts],
  controllers: [ProductsController],
})
export class AppModule {}
