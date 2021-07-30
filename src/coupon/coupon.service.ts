import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const { ownerId, itemId, qr } = body;
      return await this.prismaService.coupon.create({
        data: {
          ownerId: ownerId,
          itemId: itemId,
          qr: qr,
          isUse: false,
        },
      });
    } catch (error) {
      if (error.code === 'P2003')
        throw new NotFoundException(
          `The ${error.meta.field_name} doesn't exist in our service`,
        );
      return error;
    }
  }

  async deleteCoupon(
    couponWhereUniqueInput: Prisma.CouponWhereUniqueInput,
  ): Promise<Coupon> {
    try {
      return await this.prismaService.coupon.delete({
        where: couponWhereUniqueInput,
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }
}
