import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotAcceptableResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';

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
}
