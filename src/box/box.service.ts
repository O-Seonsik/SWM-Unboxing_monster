import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Box } from '@prisma/client';
import { BoxEntity } from './entities/box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Injectable()
export class BoxService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBoxes(): Promise<Box[]> {
    return await this.prismaService.box.findMany();
  }

  async getBox(id: number): Promise<BoxEntity> {
    const box = await this.prismaService.box.findUnique({
      where: { id: id },
      include: { items: { include: { item: true } } },
    });

    return { ...box, items: box.items.map((item) => item.item) };
  }

  async getPopularBoxes(take: number): Promise<Box[]> {
    return await this.prismaService.box.findMany({
      take: take,
      orderBy: { sales: 'desc' },
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
}
