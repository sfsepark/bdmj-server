import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
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
  async createDanji(@Request() req) {
    const { userId } = req.user;
    const danjiCreateResponse = await this.danjiService.createDanji(
      userId,
      req.body,
    );

    return danjiCreateResponse;
  }
}
