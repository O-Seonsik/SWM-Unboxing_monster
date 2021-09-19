import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersEntity } from './entities/users.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req): Promise<UsersEntity> {
    return this.usersService.getUser({ id: req.user.userId });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @Body() body: UpdateUserDto,
    @Request() req,
  ): Promise<UsersEntity> {
    return this.usersService.updateUser({
      where: { id: req.user.userId },
      data: {
        email: body.email,
        point: body.point,
        nickname: body.nickname,
      },
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Request() req) {
    return this.usersService.deleteUser({ id: req.user.userId });
  }
}
