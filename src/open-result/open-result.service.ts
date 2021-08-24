import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenResult } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { openResult } from './entities/get-open-result.entity';

@Injectable()
export class OpenResultService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOpenResult(
    boxId: number,
    skip: number,
    take: number,
  ): Promise<openResult> {
    const openResults = await this.prismaService.openResult.findMany({
      include: { user: true, item: true },
      orderBy: {
        id: 'desc',
      },
      skip: skip,
      take: take,
      where: { boxId: boxId },
    });

    const openDistribution = await this.prismaService.openResult.groupBy({
      by: ['itemId'],
      _count: {
        itemId: true,
      },
      where: { boxId: boxId },
    });
    return {
      openResults,
      openDistribution,
    };
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
