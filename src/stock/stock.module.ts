import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Stock } from './stock.model';
import { StockService } from './stock.service';

@Module({
  imports: [SequelizeModule.forFeature([Stock])],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
