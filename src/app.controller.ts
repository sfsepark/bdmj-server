import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Sequelize } from 'sequelize-typescript';
import { JwtAuthGuard } from './auth/jwt';
import { DanjiService } from './danji';
import { MemoService } from './memo';

@Controller()
export class AppController {
  constructor(
    private danjiService: DanjiService,
    private memoService: MemoService,
    private sequelize: Sequelize,
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
  @Put('danji/:id')
  async updateDanji(
    @Request() req,
    @Param('id') danjiId: string,
    @Body() body,
  ) {
    const { userId } = req.user;
    await this.danjiService.checkValidDanji(userId, danjiId);
    await this.danjiService.updateDanji(danjiId, body);

    return this.danjiService.findDanjiByPk(danjiId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('danji/:id')
  async deleteDanji(@Request() req, @Param('id') danjiId: string) {
    const { userId } = req.user;

    const transaction = await this.sequelize.transaction();

    try {
      await this.danjiService.checkValidDanji(userId, danjiId);
      await this.memoService.deleteMemosFromDanji(danjiId, transaction);
      await this.danjiService.deleteDanji(danjiId, transaction);

      transaction.commit();
    } catch {
      transaction.rollback();
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('memos')
  async getMemos(@Request() req, @Query() query) {
    const { userId } = req.user;

    await this.danjiService.checkValidDanji(userId, query?.danjiId);
    const memos = await this.memoService.findMemos({ ...query, userId });

    return { memos };
  }

  @UseGuards(JwtAuthGuard)
  @Post('memo')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async createMemo(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File,
    @Body() body,
  ) {
    const { userId } = req.user;

    await this.danjiService.checkValidDanji(userId, body?.danjiId);
    const { memoId } = await this.memoService.createMemo(body);

    return { memoId };
  }

  @UseGuards(JwtAuthGuard)
  @Put('memo/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async updateMemo(
    @Request() req,
    @Param('id') memoId: string,
    @UploadedFiles() files: Express.Multer.File,
    @Body() body,
  ) {
    const { userId } = req.user;
    await this.memoService.checkValidMemo(userId, memoId);
    await this.memoService.updateMemo(memoId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('memo/:id')
  async deleteMemo(@Request() req, @Param('id') memoId: string) {
    const { userId } = req.user;
    await this.memoService.checkValidMemo(userId, memoId);
    await this.memoService.deleteMemo(memoId);
  }
}
