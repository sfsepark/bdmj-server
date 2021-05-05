import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class Stock extends Model {
  @Column
  @PrimaryKey
  @AutoIncrement
  id: number;

  @Column
  @AllowNull(false)
  name: string;
}
