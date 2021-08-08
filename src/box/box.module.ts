import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoxService } from './box.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BoxController],
  providers: [PrismaService, BoxService],
})
export class BoxModule {}
