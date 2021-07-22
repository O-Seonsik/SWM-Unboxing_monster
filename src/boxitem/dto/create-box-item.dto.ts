import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBoxItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BoxItem)
  readonly data: BoxItem[];
}

class BoxItem {
  /**
   * Box ID(primary)
   * @example 1242321
   */
  @IsNumber()
  readonly boxId: number;

  /**
   * Item ID(primary)
   * @example 1242321
   */
  @IsNumber()
  readonly itemId: number;
}
