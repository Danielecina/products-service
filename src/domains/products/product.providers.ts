import { Product } from './product.entity';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';
export const productsProviders = [
  {
    provide: PRODUCTS_REPOSITORY,
    useValue: Product,
  },
];
