import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [PrismaService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
