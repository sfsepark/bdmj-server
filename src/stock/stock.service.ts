import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stock } from './stock.model';
import { StockPayload } from './stock.type';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock)
    private stockModel: typeof Stock,
  ) {}

  async findOrCreateStock(stockName: string): Promise<StockPayload> {
    const [{ id, name }] = await this.stockModel.findOrCreate({
      where: {
        name: stockName,
      },
    });

    return {
      id: id.toString(),
      name,
    };
  }
}
