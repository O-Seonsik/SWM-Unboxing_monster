import { Body, Controller, Post } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async createBox(@Body() box) {
    return this.itemService.createItem(box);
  }
}
