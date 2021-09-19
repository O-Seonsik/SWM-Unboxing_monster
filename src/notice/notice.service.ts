import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Notice } from '@prisma/client';

@Injectable()
export class NoticeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getNotices(): Promise<Notice[]> {
    return this.prismaService.notice.findMany();
  }

  async getNotice(
    noticeWhereUniqueInput: Prisma.NoticeWhereUniqueInput,
  ): Promise<Notice> {
    return this.prismaService.notice.findUnique({
      where: noticeWhereUniqueInput,
    });
  }
}
