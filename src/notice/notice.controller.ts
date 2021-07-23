import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { Notice } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getNotices(): Promise<Notice[]> {
    return this.prismaService.notice.findMany();
  }

  @Get(':id')
  async getNotice(@Param('id') id: number): Promise<Notice> {
    return this.prismaService.notice.findUnique({ where: { id: id } });
  }

  @Post()
  async createNotice(@Body() notice: CreateNoticeDto): Promise<Notice> {
    return this.prismaService.notice.create({ data: notice });
  }

  @Patch(':id')
  async updateNotice(
    @Body() body: UpdateNoticeDto,
    @Param('id') id: number,
  ): Promise<Notice> {
    try {
      return await this.prismaService.notice.update({
        where: { id: id },
        data: {
          imgUrl: body.imgUrl,
          srcUrl: body.srcUrl,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }

  @Delete(':id')
  async deleteNotice(@Param('id') id: number): Promise<Notice> {
    try {
      return await this.prismaService.notice.delete({ where: { id: id } });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }
}
