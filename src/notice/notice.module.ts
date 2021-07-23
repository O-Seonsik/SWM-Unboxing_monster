import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';

@Module({
  controllers: [NoticeController],
})
export class NoticeModule {}
