import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PointService, PrismaService],
  controllers: [PointController],
})
export class PointModule {}
