import { Module } from '@nestjs/common';
import { BoxitemService } from './boxitem.service';
import { BoxitemController } from './boxitem.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BoxitemController],
  providers: [BoxitemService, PrismaService],
})
export class BoxitemModule {}
