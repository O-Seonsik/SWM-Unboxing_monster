import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Item, Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({ data });
  }
}
