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
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true, // Carica automaticamente i modelli
      synchronize: true, // Sincronizza automaticamente il database (solo per sviluppo)
    }),
    DatabaseModule,
  ],
  providers: [UpdateProductStock, CreateProduct, DeleteProduct, GetProducts],
  controllers: [ProductsController],
})
export class AppModule {}
