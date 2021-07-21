import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BoxController],
  providers: [PrismaService],
})
export class BoxModule {}
