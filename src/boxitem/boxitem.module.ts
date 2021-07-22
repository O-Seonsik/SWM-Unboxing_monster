import { Module } from '@nestjs/common';
import { BoxItemController } from './boxitem.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BoxItemController],
  providers: [PrismaService],
})
export class BoxitemModule {}
