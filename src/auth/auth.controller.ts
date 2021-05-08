import {
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { GoogleTokenAuthGuard } from './guard/google.guard';

@Controller()
export class AuthController {
  @UseGuards(GoogleTokenAuthGuard)
  @Post('auth/google')
  @UseFilters(HttpExceptionFilter)
  async login(@Request() req) {
    return req.user;
  }
}
