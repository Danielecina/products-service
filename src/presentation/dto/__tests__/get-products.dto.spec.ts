import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetProductsDto } from '../get-products.dto';

describe('GetProductsDto', () => {
  let getProductsDto: GetProductsDto;

  beforeEach(() => {
    getProductsDto = new GetProductsDto();
    getProductsDto.page = 1;
    getProductsDto.perPage = 10;
  });

  test('should validate a valid get products dto', async () => {
    const errors = await validate(getProductsDto);
    expect(errors.length).toBe(0);
  });

  test('should fail validation when page is negative', async () => {
    getProductsDto.page = -1;
    const ofImportDto = plainToInstance(GetProductsDto, getProductsDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  test('should fail validation when page is not an integer', async () => {
    getProductsDto.page = 1.5;
    const ofImportDto = plainToInstance(GetProductsDto, getProductsDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  test('should fail validation when limit is negative', async () => {
    getProductsDto.perPage = -1;
    const ofImportDto = plainToInstance(GetProductsDto, getProductsDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  test('should fail validation when limit is not an integer', async () => {
    getProductsDto.perPage = 1.5;
    const ofImportDto = plainToInstance(GetProductsDto, getProductsDto);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
