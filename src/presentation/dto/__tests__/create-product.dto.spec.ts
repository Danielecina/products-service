import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from '../create-product.dto';

describe('CreateProductDto', () => {
  let createProductDto: CreateProductDto;

  beforeEach(() => {
    createProductDto = new CreateProductDto();
    createProductDto.name = 'Test Product';
    createProductDto.productToken = 'test-token';
    createProductDto.price = '99.99';
    createProductDto.stock = 10;
  });

  test('should validate a valid create product dto', async () => {
    const errors = await validate(createProductDto);
    expect(errors.length).toBe(0);
  });

  test('should fail validation when name is empty', async () => {
    createProductDto.name = '';
    const ofImportDto = plainToInstance(CreateProductDto, createProductDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  test('should fail validation when productToken is empty', async () => {
    createProductDto.productToken = '';
    const ofImportDto = plainToInstance(CreateProductDto, createProductDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  test('should fail validation when price is not decimal', async () => {
    createProductDto.price = 'abc';
    const ofImportDto = plainToInstance(CreateProductDto, createProductDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDecimal');
  });

  test('should fail validation when stock is negative', async () => {
    createProductDto.stock = -1;
    const ofImportDto = plainToInstance(CreateProductDto, createProductDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  test('should fail validation when stock is not an integer', async () => {
    createProductDto.stock = 1.5;
    const ofImportDto = plainToInstance(CreateProductDto, createProductDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
