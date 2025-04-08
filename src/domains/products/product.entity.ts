import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Product extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  Id: number;

  @Column({ unique: true })
  productToken: string;

  @Column
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' })
  stock: number;
}
