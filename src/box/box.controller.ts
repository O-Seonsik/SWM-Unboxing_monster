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
import { BoxService } from './box.service';

@ApiTags('Box')
@Controller('box')
export class BoxController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly boxService: BoxService,
  ) {}

  @Get()
  async getBoxes(): Promise<Box[]> {
    return await this.boxService.getBoxes();
  }

  @Get(':id')
  async getBox(@Param('id') id: number): Promise<BoxEntity> {
    return await this.boxService.getBox({ id: id });
  }

  @Get('popular')
  async getPopularBoxes(@Req() req): Promise<Box[]> {
    const take = req.query.take ? parseInt(req.query.take) : 5;
    if (!take) throw new BadRequestException('take must be a integer');
    return await this.boxService.getPopularBoxes(take);
  }

  @Post()
  async createBox(@Body() box: CreateBoxDto): Promise<Box> {
    return await this.boxService.createBox(box);
  }

  @Patch(':id')
  async updateBox(
    @Body() body: UpdateBoxDto,
    @Param('id') id: number,
  ): Promise<Box> {
    return await this.boxService.updateBox({
      where: { id: id },
      data: {
        title: body.title,
        price: body.price,
      },
    });
  }

  @Delete(':id')
  async deleteBox(@Param('id') id: number): Promise<Box> {
    return await this.boxService.deleteBox(id);
  }
}
