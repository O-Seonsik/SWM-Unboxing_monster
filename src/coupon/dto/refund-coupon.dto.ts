import { IsPhoneNumber } from 'class-validator';

export class RefundCouponDto {
  /**
   * 발급된 쿠폰을 문자로 받을 휴대폰 번호
   * @example 01012345678
   */
  @IsPhoneNumber()
  readonly phone: string;
}
