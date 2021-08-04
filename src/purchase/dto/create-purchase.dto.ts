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
   * 구매한 박스의 배열(id, count)
   * @example '[{boxId: 1, count: 2},{boxId: 2, count: 1}]'
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
