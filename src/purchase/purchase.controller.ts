import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { Purchase } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  async getPurchases(): Promise<Purchase[]> {
    return await this.purchaseService.getPurchases();
  }

  @Get('user/:id')
  async getUserPurchase(@Param('id') id: string): Promise<Purchase[]> {
    return await this.purchaseService.getUserPurchase({ ownerId: id });
  }

  @Get(':id')
  async getPurchase(@Param('id') id: string): Promise<Purchase> {
    return await this.purchaseService.getPurchase({ id: id });
  }

  @Post()
  async createPurchase(@Body() body: CreatePurchaseDto): Promise<Purchase> {
    return await this.purchaseService.createPurchase(body);
  }

  @Patch(':id')
  async refundPurchase(@Param('id') id: string): Promise<Purchase> {
    return await this.purchaseService.refundPurchase({ id: id });
  }
}
