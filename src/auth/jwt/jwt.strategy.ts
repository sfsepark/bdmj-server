import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPayload, UserService } from '../../user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT.SECRET'),
    });
  }

  async validate(payload: UserPayload) {
    if (await this.userService.checkLeaved(payload.id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return { userId: payload.id, userName: payload.name };
  }
}
