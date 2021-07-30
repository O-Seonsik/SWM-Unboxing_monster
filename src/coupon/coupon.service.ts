import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Coupon } from '@prisma/client';
import { CreateCouponDto } from './dto/create-coupon.dto';
@Injectable()
export class CouponService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCoupons(): Promise<Coupon[]> {
    return await this.prismaService.coupon.findMany({
      include: { owner: true },
    });
  }

  async getUserCoupon(
    couponWhereInput: Prisma.CouponWhereInput,
  ): Promise<Coupon[]> {
    return await this.prismaService.coupon.findMany({
      where: couponWhereInput,
      include: {
        owner: true,
        item: true,
      },
    });
  }

  async createCoupon(body: CreateCouponDto): Promise<Coupon> {
    const { ownerId, itemId, qr } = body;
    return await this.prismaService.coupon.create({
      data: {
        ownerId: ownerId,
        itemId: itemId,
        qr: qr,
        isUse: false,
      },
    });
  }

  async deleteCoupon(
    couponWhereUniqueInput: Prisma.CouponWhereUniqueInput,
  ): Promise<Coupon> {
    return await this.prismaService.coupon.delete({
      where: couponWhereUniqueInput,
    });
  }
}
