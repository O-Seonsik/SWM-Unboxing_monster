import { IsKoreanPhone } from './IsKoreanPhone';

export class ConfirmCouponDto {
  /**
   * 발급된 쿠폰을 문자로 받을 휴대폰 번호(No hyphen)
   * @example 01012345678
   */
  // @IsMobilePhone()
  @IsKoreanPhone('test', { message: 'test message' })
  readonly phone: string;
}
