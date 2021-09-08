import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from './payments.service';

@Module({
  imports: [HttpModule],
  providers: [PrismaService, PaymentsService],
  exports: [PaymentsService, HttpModule],
})
export class PaymentsModule {}
