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
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiForbiddenResponse({ description: '중복되는 닉네임이 존재하는 경우' })
  @ApiNotFoundResponse({ description: '요청한 유저가 존재하지 않는 경우' })
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
  @ApiNotFoundResponse({ description: '요청한 유저가 존재하지 않는 경우' })
  @Delete()
  async deleteUser(@Request() req) {
    return this.usersService.deleteUser({ id: req.user.userId });
  }
}
