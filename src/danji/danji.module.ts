import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Stock, StockModule } from '../stock';
import { Danji } from './danji.model';
import { DanjiService } from './danji.service';

@Module({
  imports: [SequelizeModule.forFeature([Danji, Stock]), StockModule],
  providers: [DanjiService],
  exports: [DanjiService],
})
export class DanjiModule {}
