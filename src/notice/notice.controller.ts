import { Controller, Get, Param } from '@nestjs/common';
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
}
