import Strategy from 'passport-auth-token';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AppleTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const user = await this.authService.validateUser('apple', token, '');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
