import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const { ownerId, boxId, count } = body;
      return await this.prismaService.boxStorage.create({
        data: {
          ownerId: ownerId,
          boxId: boxId,
          count: count,
        },
      });
    } catch (error) {
      if (error.code === 'P2003')
        throw new NotFoundException(
          `The ${error.meta.field_name} doesn't exist in our service`,
        );
      return error;
    }
  }

  async deleteBoxStorage(
    boxStorageWhereUniqueInput: Prisma.BoxStorageWhereUniqueInput,
  ): Promise<BoxStorage> {
    try {
      return await this.prismaService.boxStorage.delete({
        where: boxStorageWhereUniqueInput,
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
