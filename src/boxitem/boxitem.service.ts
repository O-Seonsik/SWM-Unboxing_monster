import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBoxItemDto } from './dto/create-box-item.dto';

@Injectable()
export class BoxitemService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
