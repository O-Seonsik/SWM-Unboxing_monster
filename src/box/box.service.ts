import { Injectable } from '@nestjs/common';
import { Prisma, Box } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoxService {
  constructor(private prisma: PrismaService) {}

  async createBox(data: Prisma.BoxCreateInput): Promise<Box> {
    return this.prisma.box.create({ data });
  }
}
