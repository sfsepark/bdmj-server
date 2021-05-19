import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { DanjiService } from 'src/danji';
import { Mood } from 'src/danji/danji.type';
import { Memo } from './memo.model';
import { MemoCreateResponse, MemoPayload } from './memo.type';

interface FindMemosArg {
  userId: string;
  danjiId: string;
  next?: string;
  size?: string;
}

interface CreateMemoArg {
  userId: string;
  mood: Mood;
  text: string;
  danjiId: string;
}

const convertMemo = ({
  id,
  danjiId,
  mood,
  image,
  text,
  createdAt,
  updatedAt,
}: Memo): MemoPayload => ({
  id: id.toString(),
  danjiId: danjiId.toString(),
  mood,
  image,
  text,
  createDate: createdAt.getTime(),
  updateDate: updatedAt.getTime(),
});

@Injectable()
export class MemoService {
  constructor(
    @InjectModel(Memo) private memoModel: typeof Memo,
    private danjiService: DanjiService,
  ) {}

  async findMemos({
    danjiId,
    next,
    size = '10',
  }: FindMemosArg): Promise<MemoPayload[]> {
    const nextDate = next ? new Date(parseInt(next)) : new Date();

    const parseSize = parseInt(size);
    if (parseSize > 100) {
      throw new HttpException(
        'Unpocessable Entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const memos = await this.memoModel.findAll({
      where: {
        danjiId: parseInt(danjiId),
        updatedAt: {
          [Op.lte]: nextDate,
        },
      },
      limit: parseSize,
      order: [
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    return memos.map(convertMemo);
  }

  async createMemo({
    mood,
    text,
    danjiId,
  }: CreateMemoArg): Promise<MemoCreateResponse> {
    const { id: memoId } = await this.memoModel.create({
      danjiId: parseInt(danjiId),
      text,
      mood,
    });

    return {
      memoId: memoId.toString(),
    };
  }

  async checkValidDanji(userId: string, danjiId: string): Promise<boolean> {
    const isValidDanji = await this.danjiService.checkDanjiOwner(
      userId,
      danjiId,
    );

    if (!isValidDanji) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
