import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'co',
      passwordField: 'co',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, co: string): Promise<User> {
    const token: string = req.headers['authorization'];
    if (!token || !token.split(' ')[1])
      throw new BadRequestException('no authentication key!', 'Unauthorized');
    const user = await this.authService.validateUser(token.split(' ')[1], co);
    if (!user)
      throw new ForbiddenException('Use it after registering as a member');
    return user;
  }
}
