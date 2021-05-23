import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Danji } from 'src/danji';
import { Memo } from './memo.model';
import { MemoService } from './memo.service';

@Module({
  imports: [SequelizeModule.forFeature([Memo, Danji])],
  providers: [MemoService],
  exports: [MemoService],
})
export class MemoModule {}
