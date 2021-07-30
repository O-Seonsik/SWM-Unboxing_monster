import { Module } from '@nestjs/common';
import { BoxStorageService } from './box-storage.service';
import { BoxStorageController } from './box-storage.controller';

@Module({
  providers: [BoxStorageService],
  controllers: [BoxStorageController],
})
export class BoxStorageModule {}
