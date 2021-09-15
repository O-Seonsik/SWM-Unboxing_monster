import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoxService } from './box.service';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { OpenResultService } from '../open-result/open-result.service';
import { CouponService } from '../coupon/coupon.service';

@Module({
  imports: [HttpModule],
  controllers: [BoxController],
  providers: [
    PrismaService,
    BoxService,
    UsersService,
    OpenResultService,
    CouponService,
  ],
})
export class BoxModule {}
