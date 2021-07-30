import { Module } from '@nestjs/common';
import { BoxStorageService } from './box-storage.service';
import { BoxStorageController } from './box-storage.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BoxStorageService, PrismaService],
  controllers: [BoxStorageController],
})
export class BoxStorageModule {}
