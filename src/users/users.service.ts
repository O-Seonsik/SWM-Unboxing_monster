import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, USER } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.USERWhereUniqueInput,
  ): Promise<USER | null> {
    return this.prisma.uSER.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.USERCreateInput): Promise<USER> {
    try {
      return await this.prisma.uSER.create({ data });
    } catch (e) {
      throw new ForbiddenException(e.code, e.meta.target);
    }
  }

  async updateUser(params: {
    where: Prisma.USERWhereUniqueInput;
    data: Prisma.USERUpdateInput;
  }): Promise<USER | any> {
    const { data, where } = params;
    try {
      return await this.prisma.uSER.update({ data, where });
    } catch (e) {
      console.log(e);
      if (e.code === 'P2025') throw new NotFoundException(e.code, e.meta.cause);
      if (e.code === 'P2002')
        throw new ForbiddenException(e.code, e.meta.target);
    }
  }

  async deleteUser(
    userWhereUniqueInput: Prisma.USERWhereUniqueInput,
  ): Promise<USER> {
    return this.prisma.uSER.delete({
      where: userWhereUniqueInput,
    });
  }
}
