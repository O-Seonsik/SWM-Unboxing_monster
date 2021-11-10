import { Controller, Get, Param, Query } from '@nestjs/common';
import { OpenResultService } from './open-result.service';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpenResultDto } from './dto/open-result.dto';

@ApiTags('open-results')
@Controller('open-result')
export class OpenResultController {
  constructor(private readonly openResultService: OpenResultService) {}

  @ApiOperation({ summary: '전체 박스 오픈 결과' })
  @Get('')
  async getOpenResult(@Query() q: OpenResultDto) {
    return await this.openResultService.getOpenResult(q.skip, q.take);
  }

  @ApiOperation({ summary: '박스 오픈 결과' })
  @Get(':id')
  async getBoxOpenResult(@Param('id') id: number, @Query() q: OpenResultDto) {
    return await this.openResultService.getBoxOpenResult(id, q.skip, q.take);
  }

  @ApiOperation({ summary: '박스 전체 결과 카운트' })
  @Get('/distribution/:id')
  async test(@Param('id') id: number) {
    return await this.openResultService.getOpenDistribution(id);
  }

  @ApiOperation({ summary: '닉네임으로 사용자의 오픈 결과 가져오기' })
  @ApiNotFoundResponse({ description: '일치하는 닉네임이 존재하지 않는 경우' })
  @Get('/nickname/:nickname')
  async getOpenResultByNickname(@Param('nickname') nickname: string) {
    return await this.openResultService.getOpenResultByNickname(nickname);
  }
}
