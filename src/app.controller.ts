import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt';
import { DanjiService } from './danji';

@Controller()
export class AppController {
  constructor(private danjiService: DanjiService) {}

  @UseGuards(JwtAuthGuard)
  @Get('danjis')
  async getDanjis(@Request() req) {
    const { userId } = req.user;
    const danjis = await this.danjiService.findAllDanjis(userId);

    return {
      danji: danjis,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('danji')
  async createDanji(@Request() req, @Body() body) {
    const { userId } = req.user;
    const danjiCreateResponse = await this.danjiService.createDanji(
      userId,
      body,
    );

    return danjiCreateResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get('memos')
  async getMemos(@Request() req) {
    const { userId } = req.user;

    return {};
  }
}
