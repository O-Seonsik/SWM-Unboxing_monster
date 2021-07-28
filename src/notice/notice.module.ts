import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { PrismaService } from '../prisma/prisma.service';
import { NoticeService } from './notice.service';

@Module({
  controllers: [NoticeController],
  providers: [PrismaService, NoticeService],
})
export class NoticeModule {}
