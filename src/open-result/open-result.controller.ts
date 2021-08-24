import { Controller, Get, Param, Query } from '@nestjs/common';
import { OpenResultService } from './open-result.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpenResultDto } from './dto/open-result.dto';

@ApiTags('open-results')
@Controller('open-result')
export class OpenResultController {
  constructor(private readonly openResultService: OpenResultService) {}

  @ApiOperation({ summary: '박스 오픈 결과' })
  @Get(':id')
  async getOpenResult(@Param('id') id: number, @Query() q: OpenResultDto) {
    return await this.openResultService.getOpenResult(id, q.skip, q.take);
  }
}
