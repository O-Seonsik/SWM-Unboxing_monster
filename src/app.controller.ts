import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { GetHelloEntity } from './entities/get-hello.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Request() req): GetHelloEntity {
    return {
      ...req.user,
      message: 'Hello world',
    };
  }
}
