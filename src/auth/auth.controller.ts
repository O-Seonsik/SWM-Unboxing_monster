import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GetTokenDto } from './dto/get-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetTokenEntity } from './entities/get-token.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @Body() body: GetTokenDto,
    @Request() req,
  ): Promise<GetTokenEntity> {
    return this.authService.getToken(req.user);
  }
}
