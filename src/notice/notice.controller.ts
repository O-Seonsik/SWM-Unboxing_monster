import { Controller, Get, Param } from '@nestjs/common';
import { Notice } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({ summary: '모든 게시글 가져오기' })
  @Get()
  async getNotices(): Promise<Notice[]> {
    return await this.noticeService.getNotices();
  }

  @ApiOperation({ summary: '특정 게시글 가져오기' })
  @Get(':id')
  async getNotice(@Param('id') id: number): Promise<Notice> {
    return this.noticeService.getNotice({ id: id });
  }
}
