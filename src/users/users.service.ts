import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: { boxStorage: true, coupon: true },
    });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(id: string, email: string, nickname: string) {
    try {
      const data: Prisma.UserCreateInput = {
        id: id,
        email: email,
        nickname: nickname,
      };

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
      if (e.code === 'P2025') throw new NotFoundException(e.code, e.meta.cause);
      if (e.code === 'P2002')
        throw new ForbiddenException(e.code, e.meta.target);
    }
  }

  async deleteUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: userWhereUniqueInput,
      });
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundException(e.code, e.meta.cause);
      if (e.code === 'P2002')
        throw new ForbiddenException(e.code, e.meta.target);
      return e;
    }
  }

  async nicknameCheck(nickname: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });

    return Boolean(user);
  }
}
