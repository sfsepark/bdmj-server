import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DanjiService } from 'src/danji';
import { Memo } from './memo.model';
import { MemoPayload } from './memo.type';

interface FindMemosArg {
  userId: string;
  danjiId: string;
  next?: number;
  size?: number;
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
    userId,
    danjiId,
    next,
    size = 10,
  }: FindMemosArg): Promise<MemoPayload[]> {
    const nextDate = next ? new Date(next) : new Date();

    const isValidDanji = await this.danjiService.checkDanjiOwner(
      userId,
      danjiId,
    );

    if (!isValidDanji) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const memos = await this.memoModel.findAll({
      where: {
        danjiId: parseInt(danjiId),
        updatedAt: {
          $lte: nextDate,
        },
      },
      limit: size,
    });

    return memos.map(convertMemo);
  }
}
