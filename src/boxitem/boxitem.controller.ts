import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoxItemDto } from './dto/create-box-item.dto';

@Controller('boxitem')
export class BoxItemController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  async getBoxItem(@Param('id') id: number) {
    // box_id 형변환 transfomer 에게 위임하기
    // BoxItem 을 활용해서 Box의 Item 리스트 확인해보기
    return await this.prismaService.boxItem.findUnique({ where: { id: id } });
  }

  @Post()
  async createBoxItems(@Body() box: CreateBoxItemDto) {
    return await this.prismaService.boxItem.createMany(box);
  }
}
