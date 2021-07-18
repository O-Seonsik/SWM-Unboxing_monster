import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getItems() {
    return this.itemService.getItems();
  }

  @Get(':id')
  async getItem(@Param('id') id: number) {
    return this.itemService.getItem({ id: id });
  }

  @Post()
  async createItem(@Body() box) {
    return this.itemService.createItem(box);
  }
}
