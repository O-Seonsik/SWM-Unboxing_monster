import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoxService } from './box.service';

@Module({
  controllers: [BoxController],
  providers: [PrismaService, BoxService],
})
export class BoxModule {}
