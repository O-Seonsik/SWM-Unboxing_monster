import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JoinUnboxingDto } from './dto/join-unboxing.dto';
import { AppleTokenDto } from './dto/apple-token.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '소셜 회원가입' })
  @ApiNotFoundResponse({ description: '사용자가 존재하지 않는 경우' })
  @ApiForbiddenResponse({ description: '중복되는 닉네임이 존재하는 경우' })
  @ApiBadRequestResponse({ description: '잘못된 토큰을 입력한 경우' })
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

    if (await this.usersService.nicknameCheck(body.nickname))
      throw new ForbiddenException('Duplicated nickname', 'Forbidden error');

    if (co === 'kakao')
      return await this.authService.kakaoJoin(
        token.split(' ')[1],
        body.email,
        body.nickname,
      );
    else if (co === 'facebook')
      return await this.authService.facebookJoin(
        token.split(' ')[1],
        body.email,
        body.nickname,
      );
    else if (co === 'apple')
      return await this.authService.appleJoin(
        token.split(' ')[1],
        body.email,
        body.nickname,
      );
    else if (co === 'apple-a')
      return await this.authService.appleJoin(
        token.split(' ')[1],
        body.email,
        body.nickname,
        true,
      );
    else throw new BadRequestException(`${co} is not supported service`);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiConflictResponse({ description: '이미 회원가입을 한 경우' })
  @ApiBadRequestResponse({ description: '잘못된 토큰을 입력한 경우' })
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
    else if (co === 'apple')
      return await this.authService.appleLogin(token.split(' ')[1]);
    else if (co === 'apple-a')
      return await this.authService.appleLogin(token.split(' ')[1], true);
    else throw new BadRequestException(`${co} is not supported service`);
  }

  @ApiBadRequestResponse({ description: '잘못된 코드를 입력한 경우' })
  @ApiOperation({ summary: '애플 코드로 토큰 획득하기' })
  @Get('token/apple')
  async getAppleToken(@Query() q: AppleTokenDto) {
    return this.authService.getAppleToken(q);
  }
}
