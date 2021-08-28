import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GetHelloEntity } from './entities/get-hello.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Request() req): GetHelloEntity {
    return {
      ...req.user,
      message: 'Hello world',
    };
  }
}
