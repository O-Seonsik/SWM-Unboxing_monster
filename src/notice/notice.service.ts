import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async createNotice(
    noticeCreateInput: Prisma.NoticeCreateInput,
  ): Promise<Notice> {
    return this.prismaService.notice.create({ data: noticeCreateInput });
  }

  async updateNotice(params: {
    where: Prisma.NoticeWhereUniqueInput;
    data: Prisma.NoticeUpdateInput;
  }): Promise<Notice> {
    const { where, data } = params;
    try {
      return await this.prismaService.notice.update({
        where: where,
        data: data,
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }

  async deleteNotice(
    noticeWhereUniqueInput: Prisma.NoticeWhereUniqueInput,
  ): Promise<Notice> {
    try {
      return await this.prismaService.notice.delete({
        where: noticeWhereUniqueInput,
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
