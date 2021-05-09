import Strategy from 'passport-google-id-token';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
    });
  }

  async validate(parsedToken, googleId) {
    const { name } = parsedToken;
    const user = await this.authService.validateUser('google', googleId, name);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
