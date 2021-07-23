import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [NoticeController],
  providers: [PrismaService],
})
export class NoticeModule {}
