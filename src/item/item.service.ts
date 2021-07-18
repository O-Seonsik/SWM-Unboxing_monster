import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Item, Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  async getItem(
    itemWhereUniqueInput: Prisma.ItemWhereUniqueInput,
  ): Promise<Item> {
    return this.prisma.item.findUnique({ where: itemWhereUniqueInput });
  }

  async getItems(): Promise<Item[]> {
    return this.prisma.item.findMany();
  }
}
