import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleTokenStrategy } from './strategy/google.strategy';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PassportModule],
  providers: [GoogleTokenStrategy, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
