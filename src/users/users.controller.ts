import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UsersEntity } from './entities/users.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.createUser(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UsersEntity> {
    return this.usersService.getUser({ id: id });
  }

  @Patch(':id')
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<UsersEntity> {
    return this.usersService.updateUser({
      where: { id: Number(id) },
      data: {
        nickname: body.nickname,
        email: body.email,
        pass: body.pass,
        phone: body.phone,
        point: body.point,
      },
    });
  }

  // delete의 cascade 때무네 뭐가 안됨 ;;
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    console.log(id);
    return this.usersService.deleteUser({ id: id });
  }
}
