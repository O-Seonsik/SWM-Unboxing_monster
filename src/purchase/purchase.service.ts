import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Purchase } from '@prisma/client';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPurchases(): Promise<Purchase[]> {
    return await this.prismaService.purchase.findMany();
  }

  async getPurchase(
    purchaseWhereUniqueInput: Prisma.PurchaseWhereUniqueInput,
  ): Promise<Purchase> {
    return await this.prismaService.purchase.findUnique({
      where: purchaseWhereUniqueInput,
      include: { owner: true, boxes: { include: { box: true } } },
    });
  }

  async createPurchase(body: CreatePurchaseDto): Promise<Purchase> {
    const { ownerId, price, boxesId } = body;
    const purchase = await this.prismaService.purchase.create({
      data: {
        ownerId: ownerId,
        price: price,
        refundAt: null,
      },
    });

    const boxPurchase = boxesId.map((boxId) => {
      return { boxId: boxId, purchaseId: purchase.id };
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.createBoxPurchase(boxPurchase);

    return await this.prismaService.purchase.findUnique({
      where: { id: purchase.id },
      include: { owner: true },
    });
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
      return error;
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
