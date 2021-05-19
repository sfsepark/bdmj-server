import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { Danji } from 'src/danji/danji.model';
import { Mood } from 'src/danji/danji.type';

@Table
export class Memo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Danji)
  @AllowNull(false)
  @Column
  danjiId: number;

  @AllowNull(false)
  @Column
  mood: Mood;

  @AllowNull(true)
  @Column
  image: string;

  @AllowNull(true)
  @Column
  text: string;
}
