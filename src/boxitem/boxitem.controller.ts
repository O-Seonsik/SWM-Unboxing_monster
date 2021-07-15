import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BoxItemService } from './boxitem.service';

@Controller('boxitem')
export class BoxItemController {
  constructor(private readonly boxItemService: BoxItemService) {}

  @Get(':id')
  async getBoxItem(@Param('id') box) {
    // box_id 형변환 transfomer 에게 위임하기
    // BoxItem 을 활용해서 Box의 Item 리스트 확인해보기
    const boxId = { boxId: +box };
    return this.boxItemService.getItems(boxId);
  }

  @Post()
  async createBoxItems(@Body('data') box) {
    console.log(box);
    return this.boxItemService.createBoxItems(box);
  }
}
