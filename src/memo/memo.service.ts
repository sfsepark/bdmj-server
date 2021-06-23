import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Danji } from 'src/danji';
import { Mood } from 'src/danji/danji.type';
import { Memo } from './memo.model';
import { MemoPayload } from './memo.type';

interface FindMemosArg {
  userId: string;
  danjiId: string;
  next?: string;
  size?: string;
}

type CreateMemoArg = UpdateMemoArg & { danjiId: string };

interface UpdateMemoArg {
  mood: Mood;
  text: string;
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
    @InjectModel(Danji) private danjiModel: typeof Danji,
  ) {}

  async deleteMemosFromDanji(danjiId: string, transaction?: Transaction) {
    await this.memoModel.destroy({
      where: {
        danjiId: parseInt(danjiId),
      },
      transaction,
    });
  }

  async checkValidMemo(userId: string, memoId: string) {
    const parsedMemoId = parseInt(memoId);

    if (!parsedMemoId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const memos = await this.memoModel.findAll({
      attributes: ['danji.id'],
      include: [{ model: this.danjiModel, attributes: ['userId'] }],
      where: {
        id: parsedMemoId,
      },
    });

    const isValid =
      memos.filter(({ danji }) => danji && danji.userId === parseInt(userId))
        .length > 0;

    if (!isValid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async deleteMemo(memoId: string) {
    this.memoModel.destroy({
      where: {
        id: parseInt(memoId),
      },
    });
  }

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
  }: CreateMemoArg): Promise<MemoPayload> {
    const memo = await this.memoModel.create({
      danjiId: parseInt(danjiId),
      text,
      mood,
    });

    return convertMemo(memo);
  }

  async updateMemo(memoId: string, { mood, text }: UpdateMemoArg) {
    await this.memoModel.update(
      { mood, text },
      { where: { id: parseInt(memoId) } },
    );
  }
}
