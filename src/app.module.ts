import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

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

console.log('DB_HOST', process.env.DB_HOST);
console.log('DB_PORT', process.env.DB_PORT);

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    DatabaseModule,
  ],
  providers: [UpdateProductStock, CreateProduct, DeleteProduct, GetProducts],
  controllers: [ProductsController],
})
export class AppModule {}
