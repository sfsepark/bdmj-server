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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { JwtAuthGuard } from './auth/jwt';
import { DanjiService } from './danji';
import { MemoService } from './memo';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

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
      data: danjis,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('danjis')
  async updateDanjisIndex(@Request() req, @Body() body) {
    const { userId } = req.user;
    const { danjiIds } = body;

    const transaction = await this.sequelize.transaction();

    await this.danjiService.checkDanjisOwner(userId, danjiIds);

    try {
      await this.danjiService.updateDanjisIndex(danjiIds, transaction);
    } catch (e) {
      await transaction.rollback();
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await transaction.commit();

    const danjis = await this.danjiService.findAllDanjis(userId);

    return {
      data: danjis,
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

    const { index, id } = danjiCreateResponse;

    return {
      index,
      danjiId: id.toString(),
      data: danjiCreateResponse,
    };
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

    return { data: memos };
  }

  @UseGuards(JwtAuthGuard)
  @Post('memo')
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      randomFilename: true,
    }),
  )
  async createMemo(@Request() req, @UploadedFile() file, @Body() body) {
    const { userId } = req.user;

    body.image = file?.Location;

    await this.danjiService.checkValidDanji(userId, body?.danjiId);
    const memoCreateResponse = await this.memoService.createMemo(body);

    const { id } = memoCreateResponse;

    return { memoId: id.toString(), data: memoCreateResponse };
  }

  @UseGuards(JwtAuthGuard)
  @Put('memo/:id')
  @UseInterceptors(AmazonS3FileInterceptor('image'))
  async updateMemo(
    @Request() req,
    @Param('id') memoId: string,
    @UploadedFile() file,
    @Body() body,
  ) {
    const { userId } = req.user;

    body.image = file?.Location;

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
