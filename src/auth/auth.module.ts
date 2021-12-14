import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import {
  GoogleAndroidTokenProvider,
  GoogleDefaultTokenProvider,
  GoogleIOSTokenProvider,
  GoogleWebTokenProvider,
} from './google';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AppleTokenStrategy } from './apple';

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
  providers: [
    AppleTokenStrategy,
    GoogleWebTokenProvider,
    GoogleIOSTokenProvider,
    GoogleDefaultTokenProvider,
    GoogleAndroidTokenProvider,
    ConfigService,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
