import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.getUser({ email: email });
    if (user && user.pass === pass) return user;
    return null;
  }

  async getToken(user) {
    const payload = { email: user.email, sub: user.id };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pass, ...result } = user;
    return {
      access_token: this.jwtService.sign(payload),
      ...result,
    };
  }
}
