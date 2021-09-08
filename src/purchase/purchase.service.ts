import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Purchase } from '@prisma/client';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async getPurchases(): Promise<Purchase[]> {
    return await this.prismaService.purchase.findMany();
  }

  async getUserPurchase(
    purchaseWhereInput: Prisma.PurchaseWhereInput,
  ): Promise<Purchase[]> {
    return await this.prismaService.purchase.findMany({
      where: purchaseWhereInput,
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
    const results = await Promise.all(
      boxes.map(async (box) => {
        const curBox = await this.prismaService.box.findUnique({
          where: { id: box.boxId },
          include: { items: { include: { item: true } } },
        });
        return curBox.items.length;
      }),
    );

    const result = results.filter((result) => !result);

    if (result.length)
      throw new ForbiddenException('Requests containing empty boxes');
    return true;
  }

  async createPurchase(body: CreatePurchaseDto): Promise<Purchase | any> {
    try {
      await this.checkPurchase(body.boxes);
      const { ownerId, price, boxes, imp_uid, merchant_uid } = body;
      const purchase = await this.prismaService.purchase.create({
        data: {
          ownerId: ownerId,
          id: merchant_uid,
          price: price,
          refundAt: null,
          imp_uid: imp_uid,
        },
      });

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

      const boxStorageList = await Promise.all(
        body.boxes.map(async (box) => {
          const boxCheck = await this.prismaService.boxStorage.findFirst({
            where: { boxId: box.boxId, ownerId: 'k1804801727' },
          });
          if (boxCheck)
            await this.prismaService.boxStorage.update({
              where: { id: boxCheck.id },
              data: {
                count: boxCheck.count + box.count,
              },
            });
          else
            return {
              ownerId: ownerId,
              boxId: box.boxId,
              count: box.count,
            };
        }),
      );

      // 결제 내용 확인..
      // payments의 checkForgery를 통해 제대로 된 결제가 진행되었는지 확인
      const forgery = await this.paymentsService.checkForgery({
        boxes: boxes,
        imp_uid: imp_uid,
      });

      if (!forgery)
        throw new BadRequestException(
          'The payments amounts has been forgery',
          'Please contact with payment manager',
        );

      if (boxStorageList.length)
        await this.prismaService.boxStorage.createMany({
          data: boxStorageList,
        });

      return await this.prismaService.purchase.findUnique({
        where: { id: purchase.id },
        include: { owner: true },
      });
    } catch (error) {
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

  async refundPurchase(
    purchaseWhereUniqueInput: Prisma.PurchaseWhereUniqueInput,
  ): Promise<Purchase> {
    const purchase = await this.prismaService.purchase.findUnique({
      where: purchaseWhereUniqueInput,
    });
    if (purchase.refundAt)
      throw new ForbiddenException(
        'Forbidden Error',
        'Already refund this purchase.',
      );
    try {
      return await this.prismaService.purchase.update({
        where: purchaseWhereUniqueInput,
        data: {
          refund: true,
          refundAt: new Date(),
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.cause);
      return error;
    }
  }
}
