import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenResult } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { openResult } from './entities/get-open-result.entity';
import { OpenDistribution } from './entities/get-open-distribution.entity';

@Injectable()
export class OpenResultService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOpenResult(skip: number, take: number): Promise<openResult[]> {
    return await this.prismaService.openResult.findMany({
      include: { user: true, item: true },
      orderBy: { id: 'desc' },
      skip: skip,
      take: take,
    });
  }

  async getBoxOpenResult(
    boxId: number,
    skip: number,
    take: number,
  ): Promise<openResult[]> {
    return await this.prismaService.openResult.findMany({
      include: { user: true, item: true },
      orderBy: { id: 'desc' },
      skip: skip,
      take: take,
      where: { boxId: boxId },
    });
  }

  async getOpenDistribution(boxId: number): Promise<OpenDistribution[]> {
    const query = await this.prismaService.openResult.groupBy({
      by: ['itemId'],
      _count: {
        itemId: true,
      },
      where: { boxId: boxId },
    });

    return query.map((item) => {
      return {
        ...item,
        _count: item._count.itemId,
      };
    });
  }

  async createOpenResult(
    boxId: number,
    userId: string,
    itemId: number,
  ): Promise<OpenResult> {
    try {
      return await this.prismaService.openResult.create({
        data: {
          boxId: boxId,
          userId: userId,
          itemId: itemId,
          openAt: new Date().toString(),
        },
      });
    } catch (error) {
      if (error.code === 'P2003')
        throw new NotFoundException(
          "The box or user or item doesn't exist in our service",
        );
      return error;
    }
  }
}
