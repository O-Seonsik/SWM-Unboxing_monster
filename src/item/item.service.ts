import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Item, Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async getItem(
    itemWhereUniqueInput: Prisma.ItemWhereUniqueInput,
  ): Promise<Item> {
    return this.prisma.item.findUnique({ where: itemWhereUniqueInput });
  }

  async getItems(): Promise<Item[]> {
    return this.prisma.item.findMany();
  }

  async createItem(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  async updateItem(params: {
    where: Prisma.ItemWhereUniqueInput;
    data: Prisma.ItemUpdateInput;
  }): Promise<Item> {
    const { where, data } = params;
    try {
      return this.prisma.item.update({ where, data });
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundException(e.code, e.meta.cause);
      if (e.code === 'P2002')
        throw new ForbiddenException(e.code, e.meta.target);
    }
  }
}
