import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(site: string, siteId: string, name: string): Promise<any> {
    const user = await this.userService.findOrCreateUser(site, siteId, name);
    if (!user) {
      return null;
    }

    return {
      sub: user.id,
      name: user.name,
    };
  }
}
