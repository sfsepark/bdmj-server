import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth';
import configuration from './config/configuration';
import { User } from './user';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>('MYSQL.HOST'),
        port: configService.get<number>('MYSQL.PORT'),
        dialect: 'mysql',
        username: configService.get<string>('MYSQL.USER'),
        password: configService.get<string>('MYSQL.PASSWORD'),
        database: configService.get<string>('MYSQL.DATABASE'),
        autoLoadModels: true,
        models: [User],
      }),
    }),
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
