import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ItemController],
  providers: [PrismaService],
})
export class ItemModule {}
