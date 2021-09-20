import {
  ArrayMinSize,
  IsArray,
  IsNumber,
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
   * 결제시 발급받는 imp_uid
   * @example imp_297510333741
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
}

class Box {
  /**
   * 구매한 박스 id
   * @example 234
   */
  @IsNumber()
  readonly boxId: number;

  /**
   * 구매한 밗의 개수
   * @example 2
   */
  @IsNumber()
  readonly count: number;
}
