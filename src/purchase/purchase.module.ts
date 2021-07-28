import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService, PurchaseService],
  controllers: [PurchaseController],
})
export class PurchaseModule {}
