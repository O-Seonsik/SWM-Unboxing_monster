import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, BoxStorage } from '@prisma/client';
import { CreateBoxStorageDto } from './dto/create-box-storage.dto';

@Injectable()
export class BoxStorageService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBoxStorage(): Promise<BoxStorage[]> {
    return await this.prismaService.boxStorage.findMany();
  }

  async getUserBoxStorage(
    boxStorageWhereInput: Prisma.BoxStorageWhereInput,
  ): Promise<BoxStorage[]> {
    return await this.prismaService.boxStorage.findMany({
      where: boxStorageWhereInput,
      include: {
        owner: true,
        box: true,
      },
    });
  }

  async createBoxStorage(body: CreateBoxStorageDto): Promise<BoxStorage> {
    const { ownerId, boxId, count } = body;
    return await this.prismaService.boxStorage.create({
      data: {
        ownerId: ownerId,
        boxId: boxId,
        count: count,
      },
    });
  }

  async deleteBoxStorage(
    boxStorageWhereUniqueInput: Prisma.BoxStorageWhereUniqueInput,
  ): Promise<BoxStorage> {
    return await this.prismaService.boxStorage.delete({
      where: boxStorageWhereUniqueInput,
    });
  }
}
