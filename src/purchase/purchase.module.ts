import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';

@Module({
  providers: [PurchaseService],
  controllers: [PurchaseController]
})
export class PurchaseModule {}
