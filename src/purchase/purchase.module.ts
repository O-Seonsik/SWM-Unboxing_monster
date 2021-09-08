import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoxStorageService } from '../box-storage/box-storage.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  providers: [PrismaService, PurchaseService, BoxStorageService],
  controllers: [PurchaseController],
  imports: [PaymentsModule],
})
export class PurchaseModule {}
