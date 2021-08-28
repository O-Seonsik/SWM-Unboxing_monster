import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JoinUnboxingDto } from './dto/join-unboxing.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @Post('join/:co')
  async joinUnboxing(
    @Param('co') co: string,
    @Request() req,
    @Body() body: JoinUnboxingDto,
  ) {
    const token = req.headers.authorization;
    if (!token || !token.split(' ')[1])
      throw new BadRequestException('no authentication key!', 'Unauthorized');
    else if (token.split(' ')[0] !== 'Bearer')
      throw new BadRequestException(
        'Token must be handed over to bearer!',
        'Unauthorized',
      );
    if (co === 'kakao')
      return await this.authService.kakaoJoin(token.split(' ')[1], body.email);
    else if (co === 'facebook')
      return await this.authService.facebookJoin(
        token.split(' ')[1],
        body.email,
      );
    else throw new BadRequestException(`${co} is not supported service`);
  }

  @ApiBearerAuth()
  @Get('login/:co')
  async loginUnboxing(@Param('co') co: string, @Request() req) {
    const token = req.headers.authorization;
    if (!token || !token.split(' ')[1])
      throw new BadRequestException('no authentication key!', 'Unauthorized');
    else if (token.split(' ')[0] !== 'Bearer')
      throw new BadRequestException(
        'Token must be handed over to bearer!',
        'Unauthorized',
      );

    if (co === 'kakao')
      return await this.authService.kakaoLogin(token.split(' ')[1]);
    else if (co === 'facebook')
      return await this.authService.facebookLogin(token.split(' ')[1]);
    else throw new BadRequestException(`${co} is not supported service`);
  }
}
