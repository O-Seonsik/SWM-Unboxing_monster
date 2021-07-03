import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GetTokenDto } from './dto/get-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @Body() body: GetTokenDto,
    @Request() req,
  ): Promise<{ access_token: string }> {
    return this.authService.getToken(req.user);
  }
}
