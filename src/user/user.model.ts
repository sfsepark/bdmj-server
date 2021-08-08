import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  site: string;

  @Column(DataType.TEXT({ length: 'long' }))
  siteId: string;
}
