import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateBoxItemDto } from './dto/create-box-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { BoxitemService } from './boxitem.service';

@ApiTags('BoxItem')
@Controller('boxitem')
export class BoxItemController {
  constructor(private readonly boxItemService: BoxitemService) {}

  @Get()
  async getBoxItem() {
    return await this.boxItemService.getBoxItem();
  }

  @Get(':id')
  async getBoxItems(@Param('id') id: number) {
    return await this.boxItemService.getBoxItems({ id: id });
  }

  @Post()
  async createBoxItems(@Body() box: CreateBoxItemDto) {
    return await this.boxItemService.createBoxItems(box);
  }

  @Delete(':id')
  async deleteBoxItem(@Param('id') id: number) {
    return await this.boxItemService.deleteBoxItem({ id: id });
  }
}
