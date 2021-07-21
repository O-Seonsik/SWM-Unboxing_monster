import { IsNumber, IsString } from 'class-validator';

export class CreateBoxDto {
  /**
   * 박스명
   * @example '한우 박스'
   */
  @IsString()
  readonly title: string;
  /**
   * 상품가격
   * @example '15000'
   */
  @IsNumber()
  readonly price: number;

  /**
   * 박스 제작자 id(key)
   * @example 'k1804801727'
   */
  @IsString()
  readonly ownerId: string;
}
