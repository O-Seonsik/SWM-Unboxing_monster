import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('boxitem')
export class BoxItemController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  async getBoxItem(@Param('id') id: number) {
    // box_id 형변환 transfomer 에게 위임하기
    // BoxItem 을 활용해서 Box의 Item 리스트 확인해보기
    return this.prismaService.boxItem.findUnique({ where: { id: id } });
  }

  @Post()
  async createBoxItems(@Body('data') box) {
    return this.prismaService.boxItem.create(box);
  }
}
