import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        host: configService.get<string>('MYSQL.HOST'),
        port: configService.get<number>('MYSQL.PORT'),
        dialect: 'mysql',
        username: configService.get<string>('MYSQL.USER'),
        password: configService.get<string>('MYSQL.PASSWORD'),
        database: configService.get<string>('MYSQL.DATABASE'),
      });
      sequelize.addModels([]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
