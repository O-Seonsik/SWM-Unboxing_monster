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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfirmCouponDto } from './dto/confirm-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @ApiOperation({ summary: '쿠폰 사용' })
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
