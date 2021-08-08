import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoxService } from './box.service';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../users/users.service';

@Module({
  imports: [HttpModule],
  controllers: [BoxController],
  providers: [PrismaService, BoxService, UsersService],
})
export class BoxModule {}
