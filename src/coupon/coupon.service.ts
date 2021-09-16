import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Coupon } from '@prisma/client';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { config, Lambda } from 'aws-sdk';
import { awsConfig } from './constants';
import { UsersService } from '../users/users.service';
import { ItemService } from '../item/item.service';

@Injectable()
export class CouponService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly itemService: ItemService,
  ) {}

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
      const { ownerId, itemId } = body;
      const now = new Date();
      const expiration = new Date(now);
      expiration.setDate(now.getDate() + 14);

      return await this.prismaService.coupon.create({
        data: {
          ownerId: ownerId,
          itemId: itemId,
          createAt: now.toString(),
          Expiration: expiration.toString(),
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

  async useCoupon(
    couponWhereUniqueInput: Prisma.CouponWhereUniqueInput,
  ): Promise<Coupon> {
    try {
      return await this.prismaService.coupon.update({
        where: couponWhereUniqueInput,
        data: {
          isUsed: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
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

  async confirmCoupon(
    userId: string,
    couponId: number,
    phone: string,
  ): Promise<Coupon> {
    // 쿠폰 아이디로 쿠폰 존재여부 확인
    try {
      const userInfo = await this.usersService.getUser({ id: userId });
      const coupon = userInfo['coupon'].find(
        (coupon) => coupon.id === couponId,
      );

      // 요청한 쿠폰을 보유하지 않은 경우
      if (!coupon)
        throw new NotFoundException(
          'Server not found this coupon',
          'Not found error',
        );

      // 쿠폰을 사용한 경우 || 환불한 경우
      if (coupon.isUsed || coupon.refund)
        throw new ConflictException(
          'Already used this coupon',
          'Conflict error',
        );

      // 쿠폰 유효기간이 만료된 경우
      const now = new Date();
      const expiration = new Date(coupon.Expiration);
      if (now > expiration)
        throw new NotAcceptableException(
          'This coupon has expired',
          'Not acceptable error',
        );

      // Payload 정상 값 넣어주기 -> productId, phoneNumber, item_title
      const { productId, title } = await this.itemService.getItem({
        id: coupon.itemId,
      });

      // 기프티콘 구매 AWS-Lambda Agent 실행
      config.update(awsConfig);
      const result = await new Lambda()
        .invoke({
          FunctionName: 'officecon-purchasing-agent',
          Payload: JSON.stringify(
            {
              product_id: productId,
              phone_number: phone,
              title: title,
              // 테스트 모드 활성화
              test: true,
            },
            null,
            2,
          ),
        })
        .promise();
      const res = JSON.parse(result.Payload.toString());

      // 보유금액 초과분 요청 경우
      if (res.StatusCode === 402)
        throw new HttpException('기프티콘 바우처 결제를 진행해야 합니다.', 402);
      // Lambda 자체 오류 예상
      else if (res.StatusCode !== 200)
        throw new InternalServerErrorException(
          'AWS Server Exception',
          'AWS Server Error',
        );

      return await this.useCoupon({ id: couponId });
    } catch (error) {
      throw error;
    }
  }

  // 쿠폰 환불
  async refundCoupon(userId: string, couponId: number): Promise<Coupon> {
    try {
      // 쿠폰 존재여부 확인
      const userInfo = await this.usersService.getUser({ id: userId });
      const coupon = userInfo['coupon'].find(
        (coupon) => coupon.id === couponId,
      );
      // 요청한 쿠폰을 보유하지 않은 경우
      if (!coupon)
        throw new NotFoundException(
          'Server not found this coupon',
          'Not found error',
        );

      // 쿠폰을 사용한 경우 || 환불한 경우
      if (coupon.isUsed || coupon.refund)
        throw new ConflictException(
          'Already used this coupon',
          'Conflict error',
        );

      // 쿠폰 유효기간이 만료된 경우
      const now = new Date();
      const expiration = new Date(coupon.Expiration);
      if (now > expiration)
        throw new NotAcceptableException(
          'This coupon has expired',
          'Not acceptable error',
        );

      // 상품 가격정보 가져오기
      const { price } = await this.itemService.getItem({
        id: coupon.itemId,
      });

      // 쿠폰 환불처리
      const usedCoupon = await this.prismaService.coupon.update({
        where: { id: couponId },
        data: {
          refund: true,
          refundAt: new Date().toString(),
        },
      });

      // 사용자 포인트 증가
      await this.usersService.updateUser({
        where: { id: userId },
        data: {
          point: {
            increment: price * 0.8,
          },
        },
      });

      return usedCoupon;
    } catch (error) {
      throw error;
    }
  }
}
