import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoxItem, Prisma } from '@prisma/client';

@Injectable()
export class BoxItemService {
  constructor(private prisma: PrismaService) {}

  async getItems(
    boxItemWhereInput: Prisma.BoxItemWhereInput,
  ): Promise<BoxItem[] | null> {
    return this.prisma.boxItem.findMany({
      where: boxItemWhereInput,
    });
  }

  async createBoxItems(
    data: Prisma.BoxItemCreateManyInput,
  ): Promise<BoxItem | any> {
    return this.prisma.boxItem.createMany({ data });
  }
}
