import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Box } from '@prisma/client';
import { BoxEntity } from './entities/box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { OpenResultService } from '../open-result/open-result.service';

@Injectable()
export class BoxService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly openResultService: OpenResultService,
  ) {}

  async getBoxes(): Promise<Box[]> {
    return await this.prismaService.box.findMany();
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
    });
  }

  async searchBoxes(keyword: string): Promise<Box[]> {
    return await this.prismaService.box.findMany({
      where: {
        title: {
          contains: keyword,
        },
      },
    });
  }
  async createBox(box: CreateBoxDto): Promise<Box> {
    try {
      return await this.prismaService.box.create({ data: box });
    } catch (e) {
      if (e.code === 'P2003')
        throw new NotFoundException("The ownerId doesn't exist in our service");
      return e;
    }
  }

  async updateBox(params: {
    where: Prisma.BoxWhereUniqueInput;
    data: Prisma.BoxUpdateInput;
  }): Promise<Box> {
    const { where, data } = params;
    try {
      return await this.prismaService.box.update({ where, data });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }

  async deleteBox(id: number): Promise<Box> {
    try {
      return await this.prismaService.box.delete({ where: { id: id } });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }

  async getBoxOpen(id: number, count: number, userId: string): Promise<any> {
    try {
      const userBoxes: any = await this.usersService.getUser({ id: userId });
      const targetBox = userBoxes.boxStorage.filter(
        (box) => box.boxId === id,
      )[0];

      if (!targetBox) {
        return new NotFoundException(
          'Not found exception',
          `User doesn't have box id ${id}`,
        );
      } else if (targetBox.count < count) {
        return new ForbiddenException(
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
        request_id: 'test',
        kwargs: kwargs,
      };

      try {
        const result = (
          await this.httpService
            .post('http://open.prider.xyz/api/random/choice', reqBody)
            .toPromise()
        ).data
          .replace(/[\[\]'\n|\r/]+/g, '')
          .split(' ')
          .map((item) => parseInt(item));

        // 당첨 기록
        result.map(async (itemId) => {
          await this.openResultService.createOpenResult(id, userId, itemId);
        });

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
        return {
          result: result,
        };
      } catch (error) {
        return new InternalServerErrorException(
          'Opening server error',
          'The opening server with blockchain is occurred error',
        );
      }
    } catch (error) {
      return error;
    }
  }

  generateProbability(
    itemPrices: number[],
    boxPrice: number,
    alpha = 0.5,
  ): number[] {
    const semiProbabilities = [];
    let baseProb = 1;

    for (let i = 0; i < itemPrices.length; i++) {
      let prob;
      if (i === itemPrices.length - 1) prob = baseProb;
      else {
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

    const counter = {};
    const prob = {};

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
