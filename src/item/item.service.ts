import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Item } from '@prisma/client';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemService {
  constructor(private readonly prismaService: PrismaService) {}
  async getItems(): Promise<Item[]> {
    return await this.prismaService.item.findMany();
  }

  async getItem(
    itemWhereUniqueInput: Prisma.ItemWhereUniqueInput,
  ): Promise<Item> {
    return await this.prismaService.item.findUnique({
      where: itemWhereUniqueInput,
    });
  }

  async createItem(itemCreateInput: Prisma.ItemCreateInput): Promise<Item> {
    try {
      return await this.prismaService.item.create({ data: itemCreateInput });
    } catch (error) {
      if (error.code === 'P2003')
        throw new NotFoundException(
          `The ${error.meta.field_name} doesn't exist in our service`,
        );
      console.log(error);
      return error;
    }
  }

  async updateItem(params: {
    where: Prisma.ItemWhereUniqueInput;
    data: Prisma.ItemUpdateInput;
  }): Promise<Item> {
    const { where, data } = params;
    try {
      return await this.prismaService.item.update({ where, data });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }

  async deleteItem(id: number): Promise<Item> {
    try {
      return await this.prismaService.item.delete({ where: { id: id } });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }
}
