import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from '@prisma/client';
import { ItemService } from './item.service';

@ApiTags('Items')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getItems(): Promise<Item[]> {
    return await this.itemService.getItems();
  }

  @Get(':id')
  async getItem(@Param('id') id: number): Promise<Item> {
    return await this.itemService.getItem({ id: id });
  }

  @Post()
  async createItem(@Body() box: CreateItemDto): Promise<Item> {
    return await this.itemService.createItem(box);
  }

  @Patch(':id')
  async updateItem(
    @Body() body: UpdateItemDto,
    @Param('id') id: number,
  ): Promise<Item> {
    return await this.itemService.updateItem({
      where: { id: id },
      data: body,
    });
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: number): Promise<Item> {
    return await this.itemService.deleteItem(id);
  }
}
