import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Box } from '@prisma/client';
import { CreateBoxDto } from './dto/create-box.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Box')
@Controller('box')
export class BoxController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  async getBox(@Param('id') id: number): Promise<Box> {
    return await this.prismaService.box.findUnique({ where: { id: id } });
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
}
