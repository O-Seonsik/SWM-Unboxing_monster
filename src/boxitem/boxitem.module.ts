import { Module } from '@nestjs/common';
import { BoxItemService } from './boxitem.service';
import { BoxItemController } from './boxitem.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BoxItemController],
  providers: [BoxItemService, PrismaService],
})
export class BoxitemModule {}
