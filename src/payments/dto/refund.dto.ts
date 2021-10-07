import { IsNumber, IsString } from 'class-validator';

export class RefundDto {
  /**
   * "아임포트 결제시 발급받은 uid || 전액 포인트로 구매한 경우 no"
   * @example imp_218715498371
   */
  @IsString()
  readonly imp_uid: string;

  /**
   * 아임포트 결제시 발급한 merchant_uid
   * @example a1.123123124.432fds090fa@.1651423923
   */
  @IsString()
  readonly merchant_uid: string;
  /**
   * 환불 가능 금액(포인트를 제외한 결제 총액 입력하면 됨)
   * @example 15000
   */
  @IsNumber()
  readonly checksum: number;
}
