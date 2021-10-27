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
import { PaymentsModule } from './payments/payments.module';
import { OpenResultModule } from './open-result/open-result.module';
import { PointModule } from './point/point.module';
import { EventModule } from './event/event.module';

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
    PaymentsModule,
    OpenResultModule,
    PointModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
