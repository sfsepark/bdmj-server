import {
  AllowNull,
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Stock } from 'src/stock';
import { User } from 'src/user';

@Table
export class Danji extends Model {
  @Column
  @PrimaryKey
  @AutoIncrement
  id: number;

  @Column
  @AllowNull(false)
  @ForeignKey(() => User)
  userId: number;

  @Column
  @AllowNull(false)
  name: string;

  @Column
  @AllowNull(false)
  @ForeignKey(() => Stock)
  stockId: number;

  @Column
  @AllowNull(false)
  volume: string;
}
