import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  @PrimaryKey
  @AutoIncrement
  id: number;

  @Column
  name: string;

  @Column
  site: string;
}
