import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { Notice } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async getNotices(): Promise<Notice[]> {
    return await this.noticeService.getNotices();
  }

  @Get(':id')
  async getNotice(@Param('id') id: number): Promise<Notice> {
    return this.noticeService.getNotice({ id: id });
  }

  @Post()
  async createNotice(@Body() notice: CreateNoticeDto): Promise<Notice> {
    return await this.noticeService.createNotice(notice);
  }

  @Patch(':id')
  async updateNotice(
    @Body() body: UpdateNoticeDto,
    @Param('id') id: number,
  ): Promise<Notice> {
    return await this.noticeService.updateNotice({
      where: { id: id },
      data: body,
    });
  }

  @Delete(':id')
  async deleteNotice(@Param('id') id: number): Promise<Notice> {
    return await this.noticeService.deleteNotice({ id: id });
  }
}
