import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Point } from '@prisma/client';
import { CreatePointDto } from './dto/create-point.dto';

@Injectable()
export class PointService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPoint(userId: string): Promise<Point[]> {
    return await this.prismaService.point.findMany({
      where: { userId: userId },
    });
  }

  async createPoint(data: CreatePointDto): Promise<Point> {
    try {
      const { userId, title, point, total, isAdd } = data;
      return await this.prismaService.point.create({
        data: {
          userId: userId,
          title: title,
          point: point,
          total: total,
          isAdd: isAdd,
          time: new Date().toString(),
        },
      });
    } catch (error) {}
  }
}
