import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleTokenStrategy } from './strategy/google.strategy';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT.SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [GoogleTokenStrategy, ConfigService, AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
