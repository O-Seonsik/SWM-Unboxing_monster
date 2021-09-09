import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentsDto {
  /**
   * 아임포트 결제시 발급한 merchant_uid
   * @example a1.123123124.432fds090fa@.1651423923
   */
  @IsString()
  readonly merchant_uid: string;
  /**
   * 아임포트 결제시 발급받은 uid
   * @example imp_218715498371
   */
  @IsString()
  readonly imp_uid: string;

  /**
   * 구매한 박스 배열
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Box)
  readonly boxes: Box[];
}

class Box {
  @IsNumber()
  /**
   * 구매한 박스의 ID
   * @example 17
   */
  boxId: number;

  /**
   * 구매한 박스의 개수
   * @example 2
   */
  @IsNumber()
  count: number;
}
