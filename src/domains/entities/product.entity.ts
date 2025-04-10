import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'products' })
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  productToken: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price: string;

  @Column({ type: DataType.INTEGER })
  stock: number;
}
