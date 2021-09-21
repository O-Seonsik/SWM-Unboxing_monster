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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBadRequestResponse({ description: '결제 요청에 위조가 발생한 경우' })
  @ApiNotFoundResponse({
    description: '구매하려는 박스가 서버에 존재하지 않는 경우',
  })
  @ApiConflictResponse({ description: '이미 처리된 결제 요청인 경우' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPurchase(
    @Body() body: CreatePurchaseDto,
    @Request() req,
  ): Promise<Purchase> {
    return await this.purchaseService.createPurchase(body, req.user.userId);
  }

  @ApiOperation({ summary: '결제확인, 환불' })
  @ApiBadRequestResponse({
    description: '존재하지 않는 ipm_uid 혹은, checksum이 올바르지 않은 경우',
  })
  @ApiNotFoundResponse({ description: 'merchant_uid 가 존재하지 않는 경우' })
  @ApiConflictResponse({ description: '이미 환불된 내역인 경우' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('refund')
  async refundPurchase(@Body() data: RefundDto, @Request() req) {
    return await this.purchaseService.refundPurchase(data, req.user.userId);
  }
}
