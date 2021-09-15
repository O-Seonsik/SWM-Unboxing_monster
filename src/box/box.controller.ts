import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Box } from '@prisma/client';
import { CreateBoxDto } from './dto/create-box.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateBoxDto } from './dto/update-box.dto';
import { BoxEntity } from './entities/box.entity';
import { BoxService } from './box.service';
import { CustomBoxDto } from './dto/custom-box.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @Get('custom')
  async getCustomBoxes(@Query() q: CustomBoxDto): Promise<Box[]> {
    const sql = `SELECT * FROM Box WHERE ownerId != 'master' ORDER BY RAND() LIMIT ${q.take};`;
    try {
      return await this.prismaService.$queryRaw(sql);
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  @Get('popular')
  async getPopularBoxes(@Req() req): Promise<Box[]> {
    const take = req.query.take ? parseInt(req.query.take) : 5;
    if (!take) throw new BadRequestException('take must be a integer');
    return await this.boxService.getPopularBoxes(take);
  }

  @Get('search/:keyword')
  async searchBoxes(@Param('keyword') keyword: string): Promise<Box[]> {
    return await this.boxService.searchBoxes(keyword);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('open/:id')
  async getBoxOpen(@Param('id') id: number, @Query() q, @Request() req) {
    return await this.boxService.getBoxOpen(
      id,
      q.count ? +q.count : 1,
      req.user.userId,
    );
  }

  @Get(':id')
  async getBox(@Param('id') id: number): Promise<BoxEntity> {
    return await this.boxService.getBox({ id: id });
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
      data: body,
    });
  }

  @Delete(':id')
  async deleteBox(@Param('id') id: number): Promise<Box> {
    return await this.boxService.deleteBox(id);
  }
}
