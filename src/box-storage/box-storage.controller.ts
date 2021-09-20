import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { BoxStorageService } from './box-storage.service';
import { BoxStorage } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('boxStorage')
@Controller('box-storage')
export class BoxStorageController {
  constructor(private readonly boxStorageService: BoxStorageService) {}

  @ApiOperation({ summary: '사용자 보유 박스 확인' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserBoxStorage(@Request() req): Promise<BoxStorage[]> {
    return await this.boxStorageService.getUserBoxStorage({
      ownerId: req.user.userId,
    });
  }
}
