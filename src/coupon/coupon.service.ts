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
import { PointService } from '../point/point.service';

@Injectable()
export class CouponService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly itemService: ItemService,
    private readonly pointService: PointService,
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

  async deleteCoupon(couponId: number, userId: string): Promise<Coupon> {
    try {
      // 쿠폰 객체 찾기
      const coupon = await this.prismaService.coupon.findUnique({
        where: { id: couponId },
      });

      // 쿠폰이 존재하지 않는 경우
      if (!coupon)
        throw new NotFoundException(
          '해당 쿠폰이 존재하지 않습니다.',
          'Not found error',
        );

      // 이미 삭제된 쿠폰인 경우
      if (!coupon.isShow)
        throw new ConflictException(
          '이미 삭제된 쿠폰입니다.',
          'Conflict error',
        );

      // 다른 사용자의 쿠폰에 접근한 경우
      if (coupon.ownerId !== userId)
        throw new ForbiddenException(
          '쿠폰 접근 권한이 없습니다.',
          'Forbidden error',
        );

      // 삭제 처리
      return await this.prismaService.coupon.update({
        where: { id: couponId },
        data: { isShow: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async confirmCoupon(
    userId: string,
    couponId: number,
    phone: string,
  ): Promise<Coupon> {
    try {
      // 쿠폰 아이디로 유저에게 쿠폰 존재여부 확인
      const coupon = await this.prismaService.coupon.findFirst({
        where: { id: couponId, ownerId: userId },
      });

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

      // Payload 정상 값 넣어주기 -> productId, phoneNumber, item_title
      const { productId, title } = await this.itemService.getItem({
        id: coupon.itemId,
      });

      // 쿠폰 사용기록
      await this.prismaService.couponUsedRecord.create({
        data: {
          productId: productId,
          owner: userId,
          usedAt: new Date().toString(),
          phone: phone,
        },
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
              test: false,
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
      // 쿠폰 아이디로 유저에게 쿠폰 존재여부 확인
      const coupon = await this.prismaService.coupon.findFirst({
        where: { id: couponId, ownerId: userId },
      });

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
      const user = await this.usersService.updateUser({
        where: { id: userId },
        data: {
          point: {
            increment: price * 0.8,
          },
        },
      });

      // 대상 상품 찾기
      const item = await this.itemService.getItem({ id: coupon.itemId });

      // 포인트 증가 기록
      await this.pointService.createPoint({
        userId: userId,
        title: item.title + ' 환불',
        point: price * 0.8,
        total: user.point,
        isAdd: true,
        time: new Date().toString(),
      });

      return usedCoupon;
    } catch (error) {
      throw error;
    }
  }
}
