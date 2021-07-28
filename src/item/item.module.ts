import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ItemService } from './item.service';

@Module({
  controllers: [ItemController],
  providers: [PrismaService, ItemService],
})
export class ItemModule {}
