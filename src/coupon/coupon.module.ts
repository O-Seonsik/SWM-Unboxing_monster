import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ItemService } from '../item/item.service';
import { PointService } from '../point/point.service';

@Module({
  controllers: [CouponController],
  providers: [
    CouponService,
    PrismaService,
    UsersService,
    ItemService,
    PointService,
  ],
})
export class CouponModule {}
