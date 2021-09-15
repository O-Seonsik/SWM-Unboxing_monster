import { IsNumber, IsString } from 'class-validator';

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
}
