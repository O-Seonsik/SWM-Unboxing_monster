import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Coupon } from '@prisma/client';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  async getCoupons(): Promise<Coupon[]> {
    return await this.couponService.getCoupons();
  }

  @Get(':id')
  async getUserCoupon(@Param('id') id: string): Promise<Coupon[]> {
    return await this.couponService.getUserCoupon({ ownerId: id });
  }

  @Post()
  async createCoupon(@Body() body: CreateCouponDto): Promise<Coupon> {
    return await this.couponService.createCoupon(body);
  }

  @Patch('use/:id')
  async useCoupon(@Param('id') id: number): Promise<Coupon> {
    return await this.couponService.useCoupon({ id: id });
  }

  @Delete(':id')
  async deleteCoupon(@Param('id') id: number): Promise<Coupon> {
    return await this.couponService.deleteCoupon({ id: id });
  }
}
