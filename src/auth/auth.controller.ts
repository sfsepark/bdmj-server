import {
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AuthService } from './auth.service';
import { GoogleTokenAuthGuard } from './guard/google.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(GoogleTokenAuthGuard)
  @Post('auth/google')
  @UseFilters(HttpExceptionFilter)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
