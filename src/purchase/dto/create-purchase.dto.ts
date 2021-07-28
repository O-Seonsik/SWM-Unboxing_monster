import { ArrayMinSize, IsNumber, IsString } from 'class-validator';

export class CreatePurchaseDto {
  /**
   * 박스를 구매한 user의 ID
   * @example 'k143214234234123'
   */
  @IsString()
  readonly ownerId: string;

  /**
   * 총 구매한 가격
   * @example 20000
   */
  @IsNumber()
  readonly price: number;
  /**
   * 구매한 박스의 아이디 배열
   * @example '[1, 2, 3, 4, 5]'
   */
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  readonly boxesId: number[];
}
