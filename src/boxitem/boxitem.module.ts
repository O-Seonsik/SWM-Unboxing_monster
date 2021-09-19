import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoxitemService } from './boxitem.service';

@Module({
  providers: [PrismaService, BoxitemService],
})
export class BoxitemModule {}
