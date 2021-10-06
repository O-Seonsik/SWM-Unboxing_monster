import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseDto {
  /**
   * 결제시 발급하는 merchant_uid(unique)
   * user_id+unix_time
   * @example k14321423423412321631083957
   */
  @IsString()
  readonly merchant_uid: string;

  /**
   * 결제시 발급받는 imp_uid, 전액 포인트 결제인 경우 no 입력
   * @example 'imp_297510333741 | no'
   */
  @IsString()
  readonly imp_uid: string;

  /**
   * 총 구매한 가격
   * @example 20000
   */
  @IsNumber()
  readonly price: number;
  /**
   * 구매한 박스의 배열(id, count)
   * @example "[{boxId: 1, count: 2},{boxId: 2, count: 1}]"
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Box)
  readonly boxes: Box[];

  /**
   * 사용한 포인트 액수
   * @example 100
   */
  @IsOptional()
  @IsNumber()
  readonly point?: number;
}

class Box {
  /**
   * 구매한 박스 id
   * @example 234
   */
  @IsNumber()
  readonly boxId: number;

  /**
   * 구매한 박스의 개수
   * @example 2
   */
  @IsNumber()
  readonly count: number;
}
