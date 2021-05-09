import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AuthModule } from './auth';
import { JwtStrategy } from './auth/jwt';
import configuration from './config/configuration';
import { DanjiModule } from './danji';
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
    DanjiModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
