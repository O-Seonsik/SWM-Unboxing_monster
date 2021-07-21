import { IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  /**
   * 상품명
   * @example '최고급 한우'
   */
  @IsString()
  readonly title: string;
  /**
   * 상품가격
   * @example '20000'
   */
  @IsNumber()
  readonly price: number;
  /**
   * 상품 대표 이미지 url
   * @example 'https://test.com/resource/test.png
   */
  @IsString()
  readonly image: string;
  /**
   * 상품 세부 설명
   * @example '최고급 한우입니다. 풀을 많이 먹고 자라서 그런지 풀맛이 나요'
   */
  @IsString()
  readonly detail: string;
}
