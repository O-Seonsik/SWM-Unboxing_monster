import { Module } from '@nestjs/common';
import { OpenResultController } from './open-result.controller';
import { OpenResultService } from './open-result.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OpenResultController],
  providers: [OpenResultService, PrismaService],
})
export class OpenResultModule {}
