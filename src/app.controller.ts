import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { query } from 'express';
import { JwtAuthGuard } from './auth/jwt';
import { DanjiService } from './danji';
import { MemoService } from './memo';

@Controller()
export class AppController {
  constructor(
    private danjiService: DanjiService,
    private memoService: MemoService,
  ) {}

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
  async getMemos(@Request() req, @Query() query) {
    const { userId } = req.user;

    const memos = await this.memoService.findMemos({ ...query, userId });

    return { memos };
  }
}
