import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { Product } from '../../domains/entities/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
