import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductsModule } from './domains/products/products.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    // configurations microservice modules
    ConfigModule.forRoot(),

    // database module
    DatabaseModule,

    // domains modules
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
