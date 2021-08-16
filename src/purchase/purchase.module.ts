import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoxStorageService } from '../box-storage/box-storage.service';

@Module({
  providers: [PrismaService, PurchaseService, BoxStorageService],
  controllers: [PurchaseController],
})
export class PurchaseModule {}
