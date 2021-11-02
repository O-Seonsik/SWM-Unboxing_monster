import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotAcceptableResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';
import { SurveyDto } from './dto/survey.dto';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @ApiOperation({ summary: '회원가입 이벤트 참여' })
  @ApiConflictResponse({ description: '이미 이벤트에 참여한 경우' })
  @ApiNotAcceptableResponse({ description: '이벤트 참여자가 초과한 경우' })
  @Get('join')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async joinEvent(@Request() req): Promise<boolean> {
    return await this.eventService.joinEvent(req.user.userId);
  }

  @ApiOperation({ summary: '회원가입 이벤트 참여 현황 확인' })
  @Get('join/check')
  async checkJoinEvent(): Promise<number> {
    return await this.eventService.checkJoinEvent();
  }

  @ApiOperation({ summary: '설문조사 이벤트 참여' })
  @ApiConflictResponse({ description: '이미 이벤트에 참여한 경우' })
  @ApiNotAcceptableResponse({ description: '이벤트 참여자가 초과한 경우' })
  @Post('survey')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async surveyEvent(
    @Request() req,
    @Body() survey: SurveyDto,
  ): Promise<boolean> {
    return await this.eventService.surveyEvent(req.user.userId, survey.survey);
  }

  @ApiOperation({ summary: '설문조사 이벤트 참여 현황 확인' })
  @Get('survey/check')
  async checkSurveyEvent(): Promise<number> {
    return await this.eventService.checkSurveyEvent();
  }

  @ApiOperation({ summary: '설문조사 이벤트 참여 여부 확인' })
  @Get('survey/check/user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async checkUserSurveyEvent(@Request() req): Promise<boolean> {
    return await this.eventService.checkUserSurveyEvent(req.user.userId);
  }
}
