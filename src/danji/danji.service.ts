import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stock, StockService } from '../stock';
import { Danji } from './danji.model';
import {
  DanjiContentPayload,
  DanjiCreateResponse,
  DanjiPayload,
} from './danji.type';

const convertDanji = ({
  createdAt,
  id,
  name,
  userId,
  color,
  stock: { id: stockId, name: stockName },
  endDate,
  volume,
  dDay,
  mood,
}: Danji): DanjiPayload => ({
  id: id.toString(),
  name,
  userId: userId.toString(),
  createDate: createdAt.getTime(),
  color,
  stock: {
    id: stockId.toString(),
    name: stockName,
  },
  endDate: endDate.getTime(),
  volume,
  dDay,
  mood,
});

@Injectable()
export class DanjiService {
  constructor(
    @InjectModel(Danji) private danjiModel: typeof Danji,
    @InjectModel(Stock) private stockModel: typeof Stock,
    private stockService: StockService,
  ) {}

  async findAllDanjis(userId: string): Promise<DanjiPayload[]> {
    const danjis = await this.danjiModel.findAll({
      include: [{ model: this.stockModel }],
      where: {
        userId: parseInt(userId),
      },
      order: [['index', 'ASC']],
    });

    return danjis.map(convertDanji);
  }

  async createDanji(
    userId: string,
    danjiContent: DanjiContentPayload,
  ): Promise<DanjiCreateResponse> {
    const { stockName, endDate, ...rest } = danjiContent;

    const parsedUserId = parseInt(userId);

    const stockPromise = this.stockService.findOrCreateStock(stockName);
    const danjiCountPromise = this.danjiModel.count({
      where: {
        userId: parsedUserId,
      },
    });

    const [{ id: stockId }, count] = await Promise.all([
      stockPromise,
      danjiCountPromise,
    ]);

    const { id: danjiId, index } = await this.danjiModel.create({
      userId: parsedUserId,
      stockId,
      index: count + 1,
      endDate: new Date(endDate),
      ...rest,
    });

    return {
      index,
      danjiId: danjiId.toString(),
    };
  }
}
