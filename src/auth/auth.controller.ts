import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AppleTokenAuthGuard } from './apple';
import { AuthService } from './auth.service';
import {
  GoogleAndroidTokenAuthGuard,
  GoogleDefaultTokenAuthGuard,
  GoogleIOSTokenAuthGuard,
  GoogleWebTokenAuthGuard,
} from './google';
import { JwtAuthGuard } from './jwt';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(GoogleDefaultTokenAuthGuard)
  @Post('auth/google')
  @UseFilters(HttpExceptionFilter)
  async gooleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(GoogleWebTokenAuthGuard)
  @Post('auth/google-web')
  @UseFilters(HttpExceptionFilter)
  async gooleWebLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(GoogleAndroidTokenAuthGuard)
  @Post('auth/google-android')
  @UseFilters(HttpExceptionFilter)
  async gooleAndroidLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(GoogleIOSTokenAuthGuard)
  @Post('auth/google-iOS')
  @UseFilters(HttpExceptionFilter)
  async gooleIOSLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AppleTokenAuthGuard)
  @Post('auth/apple')
  async appleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user')
  async leaveUser(@Request() req) {
    const { userId } = req.user;

    await this.userService.leaveUser(userId);
  }
}
