import { Module } from '@nestjs/common';
import { BoxItemController } from './boxitem.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoxitemService } from './boxitem.service';

@Module({
  controllers: [BoxItemController],
  providers: [PrismaService, BoxitemService],
})
export class BoxitemModule {}
