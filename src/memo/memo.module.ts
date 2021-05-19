import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DanjiModule } from 'src/danji';
import { Memo } from './memo.model';
import { MemoService } from './memo.service';

@Module({
  imports: [SequelizeModule.forFeature([Memo]), DanjiModule],
  providers: [MemoService],
  exports: [MemoService],
})
export class MemoModule {}
