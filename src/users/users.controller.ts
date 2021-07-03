import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.getUser({ id: id });
  }

  @Patch(':id')
  async updateUser(@Body() body: UpdateUserDto, @Param('id') id: number) {
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
}
