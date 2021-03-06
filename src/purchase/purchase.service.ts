import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Purchase } from '@prisma/client';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PaymentsService } from '../payments/payments.service';
import { RefundDto } from '../payments/dto/refund.dto';
import { PointService } from '../point/point.service';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentsService: PaymentsService,
    private readonly pointService: PointService,
  ) {}

  async getUserPurchase(
    purchaseWhereInput: Prisma.PurchaseWhereInput,
  ): Promise<Purchase[]> {
    return await this.prismaService.purchase.findMany({
      where: purchaseWhereInput,
      include: { owner: true, boxes: { include: { box: true } } },
    });
  }

  async getPurchase(
    purchaseWhereUniqueInput: Prisma.PurchaseWhereUniqueInput,
  ): Promise<Purchase | any> {
    try {
      const purchase = await this.prismaService.purchase.findUnique({
        where: purchaseWhereUniqueInput,
        include: { owner: true, boxes: { include: { box: true } } },
      });

      return {
        ...purchase,
        boxes: purchase.boxes.map((box) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return { ...box.box, count: box.count };
        }),
      };
    } catch (error) {
      throw new NotFoundException(
        `Server doesn't have ${purchaseWhereUniqueInput.id} purchase`,
        'Not Found Exception',
      );
    }
  }

  async checkPurchase(boxes): Promise<boolean> {
    try {
      const results = await Promise.all(
        boxes.map(async (box) => {
          const curBox = await this.prismaService.box.findUnique({
            where: { id: box.boxId },
            include: { items: { include: { item: true } } },
          });
          if (curBox.isDelete) return false;
          return curBox.items.length;
        }),
      );

      const result = results.filter((result) => !result);

      if (result.length)
        throw new ForbiddenException('Requests containing empty boxes');
      return true;
    } catch (error) {
      if (error.status) throw error;
      throw new NotFoundException(
        'Not found some boxes in your request',
        'Not found error',
      );
    }
  }

  async pointCheck(userId: string, point: number): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    return user.point >= point;
  }

  async createPurchase(
    body: CreatePurchaseDto,
    ownerId: string,
  ): Promise<Purchase | any> {
    try {
      await this.checkPurchase(body.boxes);

      const { price, boxes, imp_uid, merchant_uid, point } = body;
      const usedPoint = point ? point : 0;

      const purchase = await this.prismaService.purchase.create({
        data: {
          ownerId: ownerId,
          id: merchant_uid,
          price: price,
          refundAt: null,
          imp_uid: imp_uid,
          purchaseAt: new Date().toString(),
          usedPoint: usedPoint,
        },
      });

      if (!(await this.pointCheck(ownerId, usedPoint)))
        throw new ForbiddenException('???????????? ???????????????.', 'Forbidden error');

      if (purchase.usedPoint) {
        // ????????? ?????? ??????
        const user = await this.prismaService.user.update({
          where: { id: ownerId },
          data: { point: { decrement: usedPoint } },
        });

        // ????????? ?????? ??????
        await this.pointService.createPoint({
          userId: ownerId,
          title: '????????? ??????',
          point: usedPoint,
          total: user.point,
          isAdd: false,
          time: new Date().toString(),
        });
      }

      const boxPurchase = boxes.map((box) => {
        return {
          boxId: box.boxId,
          purchaseId: purchase.id,
          count: box.count,
        };
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.createBoxPurchase(boxPurchase);

      // ?????? ?????? ??????..
      // payments??? checkForgery??? ?????? ????????? ??? ????????? ?????????????????? ??????
      const forgery = await this.paymentsService.checkForgery(
        {
          merchant_uid: merchant_uid,
          boxes: boxes,
          imp_uid: imp_uid,
        },
        usedPoint,
      );

      if (!forgery)
        throw new BadRequestException(
          'The payments amounts has been forgery',
          'Please contact with payment manager',
        );

      const boxStorageList = await Promise.all(
        body.boxes.map(async (box) => {
          const boxCheck = await this.prismaService.boxStorage.findFirst({
            where: { boxId: box.boxId, ownerId: ownerId },
          });

          await this.prismaService.box.update({
            where: { id: box.boxId },
            data: {
              sales: {
                increment: box.count,
              },
            },
          });

          if (boxCheck) {
            await this.prismaService.boxStorage.update({
              where: { id: boxCheck.id },
              data: {
                count: boxCheck.count + box.count,
              },
            });
          } else
            return {
              ownerId: ownerId,
              boxId: box.boxId,
              count: box.count,
            };
        }),
      );

      if (boxStorageList.length)
        await this.prismaService.boxStorage.createMany({
          data: boxStorageList,
        });

      return await this.prismaService.purchase.findUnique({
        where: { id: purchase.id },
        include: { owner: true, boxes: true },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException(
          'This request has already been completed.',
          'Conflict Exception',
        );
      if (error.code === 'P2003')
        throw new NotFoundException(
          `The ${error.meta.field_name} doesn't exist in our service`,
        );
      throw error;
    }
  }

  async createBoxPurchase(
    boxPurchaseCreateManyInput: Prisma.BoxPurchaseCreateManyInput,
  ): Promise<boolean> {
    try {
      await this.prismaService.boxPurchase.createMany({
        data: boxPurchaseCreateManyInput,
      });
      return true;
    } catch (error) {
      if (error.code === 'P2003')
        throw new NotFoundException(
          `The ${error.meta.field_name} doesn't exist in our service`,
        );
      return Promise.reject(error);
    }
  }

  async refundPurchase(data: RefundDto, ownerId: string): Promise<Purchase> {
    const { imp_uid, merchant_uid } = data;
    try {
      const purchase = await this.prismaService.purchase.findUnique({
        where: { id: merchant_uid },
        include: { boxes: true },
      });

      if (!purchase)
        throw new NotFoundException(
          'merchant_uid ??? ???????????? ????????????.',
          'Not found exception',
        );

      if (purchase.refund)
        throw new ConflictException(
          '?????? ????????? ???????????????.',
          'Conflict exception',
        );

      await Promise.all(
        purchase.boxes.map(async (box) => {
          const userBoxCount = await this.prismaService.boxStorage.findFirst({
            where: { boxId: box.boxId, ownerId: ownerId },
          });
          if (userBoxCount === null || userBoxCount.count < box.count)
            throw new ConflictException(
              '?????? ?????? ????????? ?????? ??????????????????.',
              'Conflict Exception',
            );
        }),
      );

      // ?????? ?????????????????? ?????? ?????? ???????????? ??????
      if (imp_uid !== 'no') {
        const refund = await this.paymentsService.refund(data);
        if (!refund)
          throw new BadRequestException(
            'imp_uid ?????? checksum??? ???????????? ????????????.',
            'Bad request exception',
          );
      }

      const purchaseResult = await this.prismaService.purchase.update({
        where: { id: merchant_uid },
        data: {
          refund: true,
          refundAt: new Date().toString(),
        },
      });

      if (purchase.usedPoint) {
        // ????????? ?????? ??????
        const user = await this.prismaService.user.update({
          where: { id: ownerId },
          data: { point: { increment: purchase.usedPoint } },
        });

        // ????????? ?????? ??????
        await this.pointService.createPoint({
          userId: ownerId,
          title: '?????? ??????',
          point: purchase.usedPoint,
          total: user.point,
          isAdd: true,
          time: new Date().toString(),
        });
      }

      await Promise.all(
        purchase.boxes.map(async (box) => {
          const curBox = await this.prismaService.boxStorage.findFirst({
            where: { boxId: box.boxId, ownerId: ownerId },
          });
          if (curBox.count - box.count > 0)
            await this.prismaService.boxStorage.updateMany({
              where: { boxId: box.boxId, ownerId: ownerId },
              data: {
                count: {
                  decrement: box.count,
                },
              },
            });
          else
            await this.prismaService.boxStorage.delete({
              where: { id: curBox.id },
            });
        }),
      );

      return purchaseResult;
    } catch (error) {
      throw error;
    }
  }
}
