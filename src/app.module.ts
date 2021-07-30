import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BoxModule } from './box/box.module';
import { ItemModule } from './item/item.module';
import { BoxitemModule } from './boxitem/boxitem.module';
import { NoticeModule } from './notice/notice.module';
import { PurchaseModule } from './purchase/purchase.module';
import { CouponModule } from './coupon/coupon.module';
import { BoxStorageModule } from './box-storage/box-storage.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    BoxModule,
    ItemModule,
    BoxitemModule,
    NoticeModule,
    PurchaseModule,
    CouponModule,
    BoxStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
