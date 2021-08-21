import { BadRequestException, Body, Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}
  @Get()
  async postPayments(@Body() body) {
    const { imp_uid, merchant_uid } = body;

    try {
      // 엑세스 토큰(access token) 발급 받기
      const getToken = await this.httpService
        .post('https://api.iamport.kr/users/getToken', {
          imp_uid: imp_uid,
          merchant_uid: merchant_uid,
        })
        .toPromise();

      const { accessToken } = getToken.data.response;

      // imp_uid로 아임포트 서버에서 결제 정보 조회
      const getPaymentData = await this.httpService
        .get(`https://api.iamport.kr/payments/${imp_uid}`, {
          headers: { Authorization: accessToken },
        })
        .toPromise();

      const paymentData = getPaymentData.data.response; // 조회한 결제 정보

      // DB에서 결제되어야 하는 금액 조회
      const order = await this.prismaService.box.findUnique({
        where: { id: 1 },
      });
      const amountToBePaid = order.price; // 결제 되어야 하는 금액

      // 결제 검증하기
      const { amount, status } = paymentData;
      if (amount === amountToBePaid) {
        // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
        // DB에 결제 정보 저장하기
        switch (status) {
          case 'ready': // 가상계좌 발급
            // DB에 가상계좌 발급 정보 저장
            // 가상계좌 발급 안내 문자메시지 발송
            break;
          case 'paid': // 결제 완료
            return { status: 'success', message: '일반 결제 성공' };
        }
      } else {
        // 결제금액 불일치. 위/변조 된 결제
        return new BadRequestException('forgery', '위조된 결제시도');
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
