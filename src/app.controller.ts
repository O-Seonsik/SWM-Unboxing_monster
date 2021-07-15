import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { GetHelloEntity } from './entities/get-hello.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Get()
  getHello(@Request() req): GetHelloEntity {
    return {
      ...req.user,
      message: 'Hello world',
    };
  }
}
