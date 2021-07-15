import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { type } from 'os';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(token: string, co: string): Promise<User> {
    const userId = await this.usersService.getUserSocialId(token, co);
    if (typeof userId != 'string') throw userId;
    const user = await this.usersService.getUser({ id: userId });
    if (!user) return null;
    return user;
  }
}
