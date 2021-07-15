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

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UsersEntity> {
    return this.usersService.getUser({ id: id });
  }

  @Get()
  async getUsers(): Promise<UsersEntity[]> {
    return this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UsersEntity> {
    return this.usersService.updateUser({
      where: { id: id },
      data: {
        email: body.email,
        point: body.point,
      },
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    console.log(id);
    return this.usersService.deleteUser({ id: id });
  }
}
