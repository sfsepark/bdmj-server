import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Stock } from '../stock';
import { User } from '../user';
import { DanjiColor, Mood } from './danji.type';

@Table
export class Danji extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  color: DanjiColor;

  @AllowNull(false)
  @ForeignKey(() => Stock)
  @Column
  stockId: number;

  @BelongsTo(() => Stock)
  stock: Stock | Record<string, never>;

  @AllowNull(false)
  @Column
  volume: string;

  @AllowNull(false)
  @Column
  endDate: Date;

  @AllowNull(false)
  @Column
  dDay: number;

  @AllowNull(false)
  @Column
  index: number;

  @AllowNull(false)
  @Column
  mood: Mood;
}
