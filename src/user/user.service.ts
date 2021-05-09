import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOrCreateUser(
    site: string,
    siteId: string,
    name: string,
  ): Promise<User> {
    const [user] = await this.userModel.findOrCreate({
      where: {
        site,
        siteId,
      },
      defaults: { name },
    });

    return user;
  }
}
