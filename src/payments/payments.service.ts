import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentsDto } from './dto/payments.dto';
import { HttpService } from '@nestjs/axios';
import { impConfig } from './constants';
import { PrismaService } from '../prisma/prisma.service';
import { RefundDto } from './dto/refund.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  private async getToken(): Promise<string> {
    const { imp_key, imp_secret } = impConfig;
    try {
      const res = await this.httpService
        .post('https://api.iamport.kr/users/getToken', {
          imp_key: imp_key,
          imp_secret: imp_secret,
        })
        .toPromise();

      return res.data.response.access_token;
    } catch (error) {
      throw new UnauthorizedException('인증 실패', '결제서버에 에러 발생');
    }
  }

  private async getPaymentData(
    imp_uid: string,
  ): Promise<{ amount: number; merchant_uid: string }> {
    try {
      const accessToken = await this.getToken();
      const res = await this.httpService
        .get(`https://api.iamport.kr/payments/${imp_uid}`, {
          headers: { Authorization: accessToken },
        })
        .toPromise();

      if (res.data.response.cancel_history.length)
        throw new ConflictException(
          '이미 환불된 결제입니다.',
          'Conflict exception',
        );

      if (res.data.response.status === 'failed')
        throw new NotFoundException(
          '결제가 완료되지 않았습니다.',
          'Not found exception',
        );

      return {
        amount: res.data.response.amount,
        merchant_uid: res.data.response.merchant_uid,
      };
    } catch (error) {
      if (error.status) throw error;
      else
        throw new UnauthorizedException('인증 실패', '토큰값이 올바르지 않음');
    }
  }

  async checkForgery(data: PaymentsDto, usedPoint: number): Promise<boolean> {
    const { boxes, imp_uid, merchant_uid } = data;
    let serverData;
    // imp_uid 가 0이면 전액 포인트 결제 따라서 amount 를 0으로 초기화함
    if (imp_uid === 'no')
      serverData = { merchant_uid: merchant_uid, amount: 0 };
    else serverData = await this.getPaymentData(imp_uid);
    console.log(serverData);
    if (serverData.merchant_uid !== merchant_uid)
      throw new BadRequestException(
        'merchant_uid 가 일치하지 않음',
        'merchant_uid 가 일치하지 않음',
      );
    try {
      const amounts = {
        server: serverData.amount + usedPoint,
        client: 0,
      };

      await Promise.all(
        boxes.map(async (box) => {
          const loadedBox = await this.prismaService.box.findUnique({
            where: { id: box.boxId },
          });
          amounts.client += loadedBox.price * box.count;
        }),
      );

      const { client, server } = amounts;
      return client === server;
    } catch (error) {
      throw new NotFoundException('Not found exception', '찾을 수 없는 Box Id');
    }
  }

  async refund(data: RefundDto): Promise<boolean> {
    const { imp_uid, checksum } = data;
    try {
      const accessToken = await this.getToken();
      const res = await this.httpService
        .post(
          'https://api.iamport.kr/payments/cancel',
          {
            imp_uid: imp_uid,
            checksum: checksum,
          },
          {
            headers: { Authorization: accessToken },
          },
        )
        .toPromise();
      return res.data.code !== 1;
    } catch (error) {
      throw new InternalServerErrorException(
        '결제 서버 오류',
        'Internal server exception',
      );
    }
  }
}
