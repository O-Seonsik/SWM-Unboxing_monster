import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentsDto } from './dto/payments.dto';
import { HttpService } from '@nestjs/axios';
import { impConfig } from './constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  async getToken(): Promise<string> {
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

  async getPaymentData(imp_uid: string): Promise<number> {
    try {
      const accessToken = await this.getToken();
      const res = await this.httpService
        .get(`https://api.iamport.kr/payments/${imp_uid}`, {
          headers: { Authorization: accessToken },
        })
        .toPromise();
      return res.data.response.amount;
    } catch (error) {
      if (error.status === 401) throw error;
      else
        throw new UnauthorizedException('인증 실패', '토큰값이 올바르지 않음');
    }
  }

  async checkForgery(data: PaymentsDto): Promise<boolean> {
    const { boxes, imp_uid } = data;
    try {
      const amounts = {
        server: await this.getPaymentData(imp_uid),
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
}
