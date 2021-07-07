import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { BoxService } from './box.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BoxController],
  providers: [BoxService, PrismaService],
  exports: [BoxService, PrismaService],
})
export class BoxModule {}
