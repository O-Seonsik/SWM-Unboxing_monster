import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CouponService, PrismaService],
  controllers: [CouponController],
})
export class CouponModule {}
