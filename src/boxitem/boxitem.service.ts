import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, BoxItem } from '@prisma/client';
import { CreateBoxItemDto } from './dto/create-box-item.dto';

@Injectable()
export class BoxitemService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBoxItem(): Promise<BoxItem[]> {
    return await this.prismaService.boxItem.findMany();
  }

  async getBoxItems(boxItemWhereUniqueInput: Prisma.BoxItemWhereUniqueInput) {
    return await this.prismaService.boxItem.findUnique({
      where: boxItemWhereUniqueInput,
    });
  }

  async createBoxItems(box: CreateBoxItemDto): Promise<Prisma.BatchPayload> {
    try {
      return await this.prismaService.boxItem.createMany(box);
    } catch (error) {
      if (error.code === 'P2003')
        throw new NotFoundException(
          `The ${error.meta.field_name} doesn't exist in our service`,
        );
      console.log(error);
      return error;
    }
  }

  async deleteBoxItem(boxItemWhereUniqueInput: Prisma.BoxItemWhereUniqueInput) {
    try {
      return await this.prismaService.boxItem.delete({
        where: boxItemWhereUniqueInput,
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }
}
