import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { Purchase } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { RefundDto } from '../payments/dto/refund.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @ApiOperation({ summary: '사용자의 결제 로그 가져오기' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserPurchase(@Request() req): Promise<Purchase[]> {
    return await this.purchaseService.getUserPurchase({
      ownerId: req.user.userId,
    });
  }

  // Deprecated
  @ApiOperation({ summary: '특정 결제 로그 가져오기, Deprecated' })
  @Get(':id')
  async getPurchase(@Param('id') id: string): Promise<Purchase> {
    return await this.purchaseService.getPurchase({ id: id });
  }

  @ApiOperation({ summary: '결제확인, 사용자 박스 추가' })
  @Post()
  async createPurchase(@Body() body: CreatePurchaseDto): Promise<Purchase> {
    return await this.purchaseService.createPurchase(body);
  }

  @ApiOperation({ summary: '결제확인, 환불' })
  @Patch()
  async refundPurchase(@Body() data: RefundDto) {
    return await this.purchaseService.refundPurchase(data);
  }
}
