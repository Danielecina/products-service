import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from '../product.dto';

describe('ProductDto', () => {
  let productDto: ProductDto;

  beforeEach(() => {
    productDto = new ProductDto();
    productDto.id = 1;
    productDto.name = 'Test Product';
    productDto.productToken = 'test-token';
    productDto.price = '99.99';
    productDto.stock = 10;
  });

  test('should validate a valid product dto', async () => {
    const errors = await validate(productDto);
    expect(errors.length).toBe(0);
  });

  test('should fail validation when name is empty', async () => {
    productDto.name = '';
    const ofImportDto = plainToInstance(ProductDto, productDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  test('should fail validation when productToken is empty', async () => {
    productDto.productToken = '';
    const ofImportDto = plainToInstance(ProductDto, productDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  test('should fail validation when price is not decimal', async () => {
    productDto.price = 'abc';
    const ofImportDto = plainToInstance(ProductDto, productDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDecimal');
  });

  test('should fail validation when stock is negative', async () => {
    productDto.stock = -1;
    const ofImportDto = plainToInstance(ProductDto, productDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  test('should fail validation when stock is not an integer', async () => {
    productDto.stock = 1.5;
    const ofImportDto = plainToInstance(ProductDto, productDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
