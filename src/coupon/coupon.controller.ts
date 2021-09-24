import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Coupon } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfirmCouponDto } from './dto/confirm-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @ApiOperation({ summary: '쿠폰 사용' })
  @ApiNotFoundResponse({ description: '요청한 쿠폰을 보유하지 않은 경우' })
  @ApiConflictResponse({ description: '이미 쿠폰을 사용 혹은 환불한 경우' })
  @ApiNotAcceptableResponse({ description: '쿠폰 유효기간이 만료된 경우' })
  @ApiResponse({
    status: 402,
    description: '기프티콘 바우처 결제를 진행해야 하는 경우',
  })
  @ApiInternalServerErrorResponse({ description: 'AWS 서버 장애' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('confirm/:couponId')
  async confirmCoupon(
    @Request() req,
    @Param('couponId') couponId: number,
    @Query() q: ConfirmCouponDto,
  ): Promise<Coupon> {
    return await this.couponService.confirmCoupon(
      req.user.userId,
      couponId,
      q.phone,
    );
  }

  @ApiOperation({ summary: '쿠폰 환불' })
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: '요청한 쿠폰을 보유하지 않은 경우' })
  @ApiConflictResponse({ description: '이미 쿠폰을 사용 혹은 환불한 경우' })
  @ApiNotAcceptableResponse({ description: '쿠폰 유효기간이 만료된 경우' })
  @UseGuards(JwtAuthGuard)
  @Patch('refund/:couponId')
  async refundCoupon(
    @Request() req,
    @Param('couponId') couponId: number,
  ): Promise<Coupon> {
    return await this.couponService.refundCoupon(req.user.userId, couponId);
  }

  @ApiOperation({ summary: '사용자 쿠폰 확인' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUserCoupon(@Request() req): Promise<Coupon[]> {
    return await this.couponService.getUserCoupon({ ownerId: req.user.userId });
  }
}
