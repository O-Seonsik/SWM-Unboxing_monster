import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateCouponDto {
  /**
   * 사용자의 ID(key)
   * @example k234889287
   */
  @IsString()
  readonly ownerId: string;

  /**
   * 상품의 ID(Key)
   * @example 3422
   */
  @IsNumber()
  readonly itemId: number;

  /**
   * 상품 QR URL
   * @example 1242321
   */
  @IsUrl()
  readonly qr: string;
}
