import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AppleTokenAuthGuard } from './apple';
import { AuthService } from './auth.service';
import { GoogleTokenAuthGuard } from './google/google.guard';
import { JwtAuthGuard } from './jwt';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(GoogleTokenAuthGuard)
  @Post('auth/google')
  @UseFilters(HttpExceptionFilter)
  async gooleLogin(@Request() req) {
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
