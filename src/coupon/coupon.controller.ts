import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Coupon } from '@prisma/client';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfirmCouponDto } from './dto/confirm-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  async getCoupons(): Promise<Coupon[]> {
    return await this.couponService.getCoupons();
  }

  @ApiOperation({ summary: '쿠폰 사용' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('confirm/:couponId')
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

  @Patch('use/:id')
  async useCoupon(@Param('id') id: number): Promise<Coupon> {
    return await this.couponService.useCoupon({ id: id });
  }

  @Get(':id')
  async getUserCoupon(@Param('id') id: string): Promise<Coupon[]> {
    return await this.couponService.getUserCoupon({ ownerId: id });
  }

  @Post()
  async createCoupon(@Body() body: CreateCouponDto): Promise<Coupon> {
    return await this.couponService.createCoupon(body);
  }

  @Delete(':id')
  async deleteCoupon(@Param('id') id: number): Promise<Coupon> {
    return await this.couponService.deleteCoupon({ id: id });
  }
}
