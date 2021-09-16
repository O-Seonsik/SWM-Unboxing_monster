import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ItemService } from '../item/item.service';

@Module({
  controllers: [CouponController],
  providers: [CouponService, PrismaService, UsersService, ItemService],
})
export class CouponModule {}
