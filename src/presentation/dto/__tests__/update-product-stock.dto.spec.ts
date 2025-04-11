import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateProductStockDto } from '../update-product-stock.dto';

describe('UpdateProductStockDto', () => {
  let updateProductStockDto: UpdateProductStockDto;

  beforeEach(() => {
    updateProductStockDto = new UpdateProductStockDto();
    updateProductStockDto.stock = 1;
  });

  test('should validate a valid update product stock dto', async () => {
    const errors = await validate(updateProductStockDto);
    expect(errors.length).toBe(0);
  });

  test('should fail validation when quantity is not an integer', async () => {
    updateProductStockDto.stock = 1.5;
    const ofImportDto = plainToInstance(
      UpdateProductStockDto,
      updateProductStockDto,
    );
    const errors = await validate(ofImportDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
