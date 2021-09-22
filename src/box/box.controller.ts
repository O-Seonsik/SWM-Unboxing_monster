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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiNotFoundResponse({
    description: 'ownerId에 매치되는 유저가 존재하지 않을경우',
  })
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
  @ApiNotFoundResponse({
    description: '박스 번호에 해당하는 박스가 존재하지 않는 경우',
  })
  @Get(':id')
  async getBox(@Param('id') id: number): Promise<BoxEntity> {
    return await this.boxService.getBox({ id: id });
  }

  @ApiOperation({ summary: '박스 오픈' })
  @ApiForbiddenResponse({
    description:
      '오픈하려는 상자의 개수만큼 사용자가 상자를 보유하지 않은 경우',
  })
  @ApiInternalServerErrorResponse({
    description: '오픈 서버에 장애가 발생한 경우',
  })
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
  @ApiBadRequestResponse({
    description: '존재하지 않는 아이템을 담은 상자 생성 요청시',
  })
  @ApiForbiddenResponse({
    description: '박스 가격이 상품들의 가격을 초과 혹은 미만인 경우',
  })
  @ApiNotFoundResponse({
    description: 'ownerId에 매치되는 유저가 존재하지 않을경우',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBox(@Body() box: CreateBoxDto, @Request() req): Promise<Box> {
    return await this.boxService.createBox(box, req.user.userId);
  }

  @ApiOperation({ summary: '커스텀 박스 삭제' })
  @ApiNotFoundResponse({
    description: '박스 번호에 해당하는 박스가 존재하지 않는 경우',
  })
  @ApiForbiddenResponse({
    description: '삭제 요청 사용자의 id와 박스 ownerId가 다른 경우',
  })
  @ApiConflictResponse({ description: '이미 박스를 삭제한 경우' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBox(@Param('id') id: number, @Request() req): Promise<Box> {
    return await this.boxService.deleteBox(id, req.user.userId);
  }
}
