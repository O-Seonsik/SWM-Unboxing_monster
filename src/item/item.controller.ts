import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from '@prisma/client';

@ApiTags('Items')
@Controller('item')
export class ItemController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getItems(): Promise<Item[]> {
    return await this.prismaService.item.findMany();
  }

  @Get(':id')
  async getItem(@Param('id') id: number): Promise<Item> {
    return await this.prismaService.item.findUnique({ where: { id: id } });
  }

  @Post()
  async createItem(@Body() box: CreateItemDto): Promise<Item> {
    return await this.prismaService.item.create({ data: box });
  }

  @Patch(':id')
  async updateItem(
    @Body() body: UpdateItemDto,
    @Param('id') id: number,
  ): Promise<Item> {
    try {
      return await this.prismaService.item.update({
        where: { id: id },
        data: {
          title: body.title,
          price: body.price,
          image: body.image,
          detail: body.detail,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: number): Promise<Item> {
    try {
      return await this.prismaService.item.delete({ where: { id: id } });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }
}
