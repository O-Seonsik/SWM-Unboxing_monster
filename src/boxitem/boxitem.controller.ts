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
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoxItemDto } from './dto/create-box-item.dto';
import { UpdateBoxItemDto } from './dto/update-box-item.dto';

@Controller('boxitem')
export class BoxItemController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getBoxItem() {
    return await this.prismaService.boxItem.findMany();
  }

  @Get(':id')
  async getBoxItems(@Param('id') id: number) {
    // box_id 형변환 transfomer 에게 위임하기
    // BoxItem 을 활용해서 Box의 Item 리스트 확인해보기
    return await this.prismaService.boxItem.findUnique({ where: { id: id } });
  }

  @Post()
  async createBoxItems(@Body() box: CreateBoxItemDto) {
    try {
      return await this.prismaService.boxItem.createMany(box);
    } catch (error) {
      if (error.code === 'P2003')
        throw new NotFoundException(
          `The ${error.meta.field_name} doesn't exist in our service`,
        );
      return error;
    }
  }

  @Patch(':id')
  async updateBoxItem(@Body() body: UpdateBoxItemDto, @Param('id') id: number) {
    try {
      return await this.prismaService.boxItem.update({
        where: { id: id },
        data: body,
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
  async deleteBoxItem(@Param('id') id: number) {
    return await this.prismaService.boxItem.delete({ where: { id: id } });
  }
  catch(error) {
    if (error.code === 'P2025')
      throw new NotFoundException(error.code, error.meta.cause);
    if (error.code === 'P2002')
      throw new ForbiddenException(error.code, error.meta.target);
    return error;
  }
}
