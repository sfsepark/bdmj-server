import { MulterExtendedModule } from 'nestjs-multer-extended';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AuthModule } from './auth';
import { JwtStrategy } from './auth/jwt';
import configuration from './config/configuration';
import { DanjiModule } from './danji';
import { MemoModule } from './memo';
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
    MulterExtendedModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        awsConfig: {
          accessKeyId: configService.get<string>('SPACE.KEY'),
          secretAccessKey: configService.get<string>('SPACE.SECRET'),
        },
        bucket: configService.get<string>('SPACE.ENDPOINT'),
        basePath: '/memo/',
        fileSize: 1 * 1024 * 1024 * 10,
        endpoint: 'nyc3.digitaloceanspaces.com',
        acl: 'public-read',
      }),
    }),
    DanjiModule,
    MemoModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
