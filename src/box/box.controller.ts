import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Box } from '@prisma/client';
import { CreateBoxDto } from './dto/create-box.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoxEntity } from './entities/box.entity';
import { BoxService } from './box.service';
import { CustomBoxDto } from './dto/custom-box.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkipTakeDto } from './dto/skip-take.dto';

@ApiTags('Box')
@Controller('box')
export class BoxController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly boxService: BoxService,
  ) {}

  @ApiOperation({ summary: '관리자 등록 박스 모두 가져오기' })
  @Get()
  async getBoxes(@Query() req: SkipTakeDto): Promise<Box[]> {
    if (Math.abs(req.skip - req.take) > 100)
      throw new BadRequestException(
        '1회당 최대 요청 범위 초과',
        'Bad request error',
      );
    return await this.boxService.getBoxes(req.skip, req.take);
  }

  @ApiOperation({ summary: '특정 유저의 커스텀박스 모두 가져오기' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('custom')
  async getBoxesUser(@Request() req, @Query() q: SkipTakeDto): Promise<Box[]> {
    if (Math.abs(q.skip - q.take) > 100)
      throw new BadRequestException(
        '1회당 최대 요청 범위 초과',
        'Bad request error',
      );
    return await this.boxService.getUserBox(req.user.userId, q.skip, q.take);
  }

  @ApiOperation({ summary: '커스텀 박스 랜덤으로 N개 가져오기' })
  @Get('custom/random')
  async getCustomBoxes(@Query() q: CustomBoxDto): Promise<Box[]> {
    const sql = `SELECT * FROM Box WHERE isManager = false ORDER BY RAND() LIMIT ${q.take};`;
    try {
      return await this.prismaService.$queryRaw(sql);
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  @ApiOperation({ summary: '모든 박스 중 인기 박스 5개' })
  @Get('popular')
  async getPopularBoxes(@Req() req): Promise<Box[]> {
    const take = req.query.take ? parseInt(req.query.take) : 5;
    if (!take) throw new BadRequestException('take must be a integer');
    return await this.boxService.getPopularBoxes(take);
  }

  @ApiOperation({ summary: '박스 이름으로 검색' })
  @Get('search/:keyword')
  async searchBoxes(@Param('keyword') keyword: string): Promise<Box[]> {
    return await this.boxService.searchBoxes(keyword);
  }

  @ApiOperation({ summary: '박스 번호로 검색' })
  @Get(':id')
  async getBox(@Param('id') id: number): Promise<BoxEntity> {
    return await this.boxService.getBox({ id: id });
  }

  @ApiOperation({ summary: '박스 오픈' })
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

  @ApiOperation({ summary: '커스텀 박스 생성' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBox(@Body() box: CreateBoxDto, @Request() req): Promise<Box> {
    return await this.boxService.createBox(box, req.user.userId);
  }

  @ApiOperation({ summary: '커스텀 박스 삭제' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBox(@Param('id') id: number, @Request() req): Promise<Box> {
    return await this.boxService.deleteBox(id, req.user.userId);
  }
}
