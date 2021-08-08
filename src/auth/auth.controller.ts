import {
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AppleTokenAuthGuard } from './apple/apple.guard';
import { AuthService } from './auth.service';
import { GoogleTokenAuthGuard } from './google/google.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
