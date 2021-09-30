import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PointService } from './point.service';
import { Point } from '@prisma/client';
import { SkipTakeDto } from '../box/dto/skip-take.dto';

@ApiTags('point')
@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @ApiOperation({ summary: '사용자 포인트 사용기록 가져오기' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPoint(@Request() req, @Query() q: SkipTakeDto): Promise<Point[]> {
    if (Math.abs(q.skip - q.take) > 100)
      throw new BadRequestException(
        '1회당 최대 요청 범위 초과',
        'Bad request error',
      );
    return this.pointService.getPoint(req.user.userId);
  }
}
