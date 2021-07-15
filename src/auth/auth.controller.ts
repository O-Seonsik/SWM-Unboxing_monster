import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { VerifyTokenEntity } from './entities/verify-token.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @Body() body: VerifyTokenDto,
    @Request() req,
  ): Promise<VerifyTokenEntity> {
    return req.user;
  }
}
