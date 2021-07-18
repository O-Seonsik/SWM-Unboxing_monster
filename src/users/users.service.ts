import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { getWebAccessToken } from '../auth/constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getKakaoId(token: string) {
    return await fetch('https://kapi.kakao.com/v1/user/access_token_info', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) return 'k' + data.id;
        else if (data.code == -401)
          throw new UnauthorizedException('this access token does not exist.');
        else if (data.code == -2)
          throw new UnauthorizedException('too long for access token.');
      })
      .catch((err) => err);
  }

  async getFacebookId(token: string) {
    return await fetch(
      'https://graph.facebook.com/debug_token?' +
        'input_token=' +
        token +
        '&access_token=' +
        (await getWebAccessToken()),
    )
      .then((res) => res.json())
      .then((data) => {
        const res = data.data;
        if (res.user_id) return 'f' + data.data.user_id;
        else throw new UnauthorizedException(res.error.message);
      })
      .catch((err) => err);
  }

  async getUserSocialId(token, co) {
    if (co === 'kakao') return this.getKakaoId(token);
    else if (co === 'facebook') return this.getFacebookId(token);
    else if (co === 'apple') return 'apple';
  }

  async createUser(user: CreateUserDto) {
    try {
      const userId = await this.getUserSocialId(user.token, user.co);
      const data: Prisma.UserCreateInput = {
        id: userId,
        email: user.email,
      };
      if (typeof data.id != 'string') return userId.response;
      return await this.prisma.user.create({ data });
    } catch (e) {
      throw new ForbiddenException('Already registered users', e.meta.target);
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { data, where } = params;
    try {
      return await this.prisma.user.update({ data, where });
    } catch (e) {
      console.log(e);
      if (e.code === 'P2025') throw new NotFoundException(e.code, e.meta.cause);
      if (e.code === 'P2002')
        throw new ForbiddenException(e.code, e.meta.target);
    }
  }

  async deleteUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return this.prisma.user.delete({
      where: userWhereUniqueInput,
    });
  }
}
