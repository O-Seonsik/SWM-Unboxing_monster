import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { Purchase } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getPurchases(): Promise<Purchase[]> {
    return await this.purchaseService.getPurchases();
  }

  @Get(':id')
  async getPurchase(@Param('id') id: number): Promise<Purchase> {
    return await this.purchaseService.getPurchase({ id: id });
  }

  @Post()
  async createPurchase(@Body() body: CreatePurchaseDto) {
    return await this.purchaseService.createPurchase(body);
  }

  @Patch(':id')
  async refundPurchase(@Param('id') id: number) {
    return await this.purchaseService.refundPurchase({ id: id });
  }
}
