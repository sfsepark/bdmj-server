import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService, UserPayload } from '../user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    site: string,
    siteId: string,
    name: string,
  ): Promise<UserPayload> {
    const user = await this.userService.findOrCreateUser(site, siteId, name);
    if (!user) {
      return null;
    }

    return {
      id: user.id.toString(),
      name: user.name,
    };
  }

  async login(userPayload: UserPayload) {
    return {
      access_token: this.jwtService.sign(userPayload),
    };
  }
}
