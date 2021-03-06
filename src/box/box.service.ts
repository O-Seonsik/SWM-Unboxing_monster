import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Box } from '@prisma/client';
import { BoxEntity } from './entities/box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { OpenResultService } from '../open-result/open-result.service';
import { CouponService } from '../coupon/coupon.service';

@Injectable()
export class BoxService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly openResultService: OpenResultService,
    private readonly couponService: CouponService,
  ) {}

  async getBoxes(skip: number, take: number): Promise<Box[]> {
    return await this.prismaService.box.findMany({
      skip: skip,
      take: take,
      where: {
        isManager: true,
        isDelete: false,
      },
    });
  }

  async getUserBox(id: string, skip: number, take: number): Promise<Box[]> {
    return await this.prismaService.box.findMany({
      skip: skip,
      take: take,
      where: { ownerId: id, isDelete: false },
    });
  }

  async getBox(
    boxWhereUniqueInput: Prisma.BoxWhereUniqueInput,
  ): Promise<BoxEntity> {
    try {
      const box = await this.prismaService.box.findUnique({
        where: boxWhereUniqueInput,
        include: { items: { include: { item: true } } },
      });
      if (!box)
        throw new NotFoundException(
          `The ${boxWhereUniqueInput.id} box is not here`,
          'Not found exception',
        );
      return { ...box, items: box.items.map((item) => item.item) };
    } catch (error) {
      return error;
    }
  }

  async getPopularBoxes(take: number): Promise<Box[]> {
    return await this.prismaService.box.findMany({
      take: take,
      orderBy: { sales: 'desc' },
      where: { isDelete: false },
    });
  }

  async searchBoxes(keyword: string): Promise<Box[]> {
    return await this.prismaService.box.findMany({
      where: {
        title: {
          contains: keyword,
        },
        isDelete: false,
      },
    });
  }

  async createBox(box: CreateBoxDto, user: string): Promise<Box> {
    try {
      const { title, price, image, isLocal, detail, boxItems } = box;

      // ?????? ?????? ???????????? && ???????????? ?????? ????????? ????????????
      const prices = await Promise.all(
        boxItems.map(async (item) => {
          const curItem = await this.prismaService.item.findUnique({
            where: { id: item },
          });
          if (!curItem)
            throw new ForbiddenException(
              '???????????? ?????? ????????? ???????????? ????????????.',
              'Forbidden error',
            );
          return curItem.price;
        }),
      );

      // ?????? ???????????? ????????? ????????? ???????????? ????????? ?????? ????????????
      if (price < Math.min(...prices) || price > Math.max(...prices))
        throw new BadRequestException(
          '????????? ????????? ?????? ????????? ?????? ????????? ?????? ????????? ?????? ?????? ????????? ????????? ??????????????? ?????????.',
          'Bad request error',
        );

      // ?????? ??????
      const result = await this.prismaService.box.create({
        data: {
          title: title,
          price: price,
          image: image,
          isLocal: isLocal,
          detail: detail,
          ownerId: user,
        },
      });

      // ????????? ?????? ????????? ?????? ??????
      const data = boxItems.map((item) => {
        return {
          boxId: result.id,
          itemId: item,
        };
      });

      // ????????? ????????? ??????
      await this.prismaService.boxItem.createMany({ data: data });
      return result;
    } catch (e) {
      if (e.code === 'P2003')
        throw new NotFoundException("The ownerId doesn't exist in our service");
      throw e;
    }
  }

  async deleteBox(id: number, userId: string): Promise<Box> {
    try {
      const box = await this.getBox({ id: id });
      if (box.ownerId !== userId)
        throw new ForbiddenException(
          '?????? ????????? ????????? ????????????.',
          'Forbidden error',
        );

      if (box['isDelete'])
        throw new ConflictException(
          '?????? ????????? ???????????????.',
          'Conflict error',
        );

      return await this.prismaService.box.update({
        where: { id: id },
        data: { isDelete: true },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      throw error;
    }
  }

  async getBoxOpen(id: number, count: number, userId: string): Promise<any> {
    try {
      const targetBox = await this.prismaService.boxStorage.findFirst({
        where: { ownerId: userId, boxId: id },
      });

      if (!targetBox) {
        throw new NotFoundException(
          'Not found exception',
          `User doesn't have box id ${id}`,
        );
      } else if (targetBox.count < count) {
        throw new ForbiddenException(
          'Forbidden exception',
          `User has only ${targetBox.count} boxes but request ${count} boxes`,
        );
      }

      const openBox: any = await this.prismaService.box.findUnique({
        where: { id: id },
        include: { items: { include: { item: true } } },
      });

      const data = openBox.items.map((item) => {
        return {
          id: item.item.id,
          price: item.item.price,
        };
      });

      data.sort((a, b) => (a.price < b.price ? 1 : -1));
      const reverseSortedList = data.map((item) => item.price);
      const a = data.map((item) => item.id.toString());
      const prob = this.generateProbability(reverseSortedList, openBox.price);
      const kwargs = JSON.stringify({ a: a, p: prob, size: count });
      const reqBody = {
        request_id: 'unboxing_monster',
        kwargs: kwargs,
      };

      try {
        const data = (
          await this.httpService
            .post('https://open.unboxing.monster/api/random/choice', reqBody)
            .toPromise()
        ).data;

        const result = data.result;

        // ?????? ??????
        result.map(async (itemId) => {
          await this.openResultService.createOpenResult(
            id,
            userId,
            +itemId,
            data.block_hash,
            data.seed,
            data.tx_hash,
          );
        });

        // ?????? ?????? ??????
        if (targetBox.count - count) {
          await this.prismaService.boxStorage.update({
            where: { id: targetBox.id },
            data: { count: targetBox.count - count },
          });
        } else {
          await this.prismaService.boxStorage.delete({
            where: { id: targetBox.id },
          });
        }

        // ????????? ????????? ????????? ????????????
        return await Promise.all(
          result.map(async (item) => {
            try {
              return await this.couponService.createCoupon({
                ownerId: userId,
                itemId: +item,
              });
            } catch (error) {
              console.log(error);
            }
          }),
        );
      } catch (error) {
        throw new InternalServerErrorException(
          'Opening server error',
          'The opening server with blockchain is occurred error',
        );
      }
    } catch (error) {
      throw error;
    }
  }
  generateProbability(
    itemPrices: number[],
    boxPrice: number,
    alpha = 0.5,
  ): number[] {
    const semiProbabilities = [];
    let baseProb = 1;
    boxPrice *= 1.03;

    for (let i = 0; i < itemPrices.length; i++) {
      let prob;
      if (itemPrices[i] === itemPrices[itemPrices.length - 1]) {
        prob = baseProb;
        baseProb -= prob;
      } else {
        const remain = itemPrices.slice(i + 1);
        const nextBoxPrice =
          alpha * Math.min(remain[0], boxPrice) +
          (1 - alpha) * remain[remain.length - 1];
        const p = (boxPrice - nextBoxPrice) / (itemPrices[i] - nextBoxPrice);
        prob = baseProb * p;
        baseProb -= prob;
        boxPrice = nextBoxPrice;
      }
      semiProbabilities.push(prob);
    }

    const counter: { [keys: number]: number } = {};
    const prob: { [keys: number]: number } = {};

    for (let i = 0; i < itemPrices.length; i++) {
      const price = itemPrices[i];
      const sProb = semiProbabilities[i];

      if (counter[price]) {
        counter[price] += 1;
        prob[price] += sProb;
      } else {
        counter[price] = 1;
        prob[price] = sProb;
      }
    }

    return itemPrices.map((price) => {
      return prob[price] / counter[price];
    });
  }
}
