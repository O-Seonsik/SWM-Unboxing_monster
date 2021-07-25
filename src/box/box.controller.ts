import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Box } from '@prisma/client';
import { CreateBoxDto } from './dto/create-box.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBoxDto } from './dto/update-box.dto';
import { BoxEntity } from './entities/box.entity';

@ApiTags('Box')
@Controller('box')
export class BoxController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getBoxes(): Promise<Box[]> {
    return await this.prismaService.box.findMany();
  }

  @Get('popular')
  async getPopularBoxes(@Req() req): Promise<Box[]> {
    const take = req.query.take ? parseInt(req.query.take) : 5;
    if (!take) throw new BadRequestException('take must be a integer');
    return await this.prismaService.box.findMany({
      take: take,
      orderBy: { sales: 'desc' },
    });
  }

  @Get(':id')
  async getBox(@Param('id') id: number): Promise<BoxEntity> {
    const box = await this.prismaService.box.findUnique({
      where: { id: id },
      include: { items: { include: { item: true } } },
    });

    return { ...box, items: box.items.map((item) => item.item) };
  }

  @Post()
  async createBox(@Body() box: CreateBoxDto): Promise<Box> {
    try {
      return await this.prismaService.box.create({ data: box });
    } catch (e) {
      if (e.code === 'P2003')
        throw new NotFoundException("The ownerId doesn't exist in our service");
      return e;
    }
  }

  @Patch(':id')
  async updateBox(
    @Body() body: UpdateBoxDto,
    @Param('id') id: number,
  ): Promise<Box> {
    try {
      return await this.prismaService.box.update({
        where: { id: id },
        data: {
          title: body.title,
          price: body.price,
          ownerId: body.ownerId,
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
  async deleteBox(@Param('id') id: number): Promise<Box> {
    try {
      return await this.prismaService.box.delete({ where: { id: id } });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(error.code, error.meta.cause);
      if (error.code === 'P2002')
        throw new ForbiddenException(error.code, error.meta.target);
      return error;
    }
  }
}
