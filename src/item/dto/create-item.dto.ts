import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateItemDto {
  /**
   * 판매처에서의 상품 코드
   * @example 0000004002
   */
  @IsString()
  readonly productId: string;

  /**
   * 판매처 1 - officecon
   * @example 1
   */
  @IsNumber()
  readonly seller: number;

  /**
   * 상품명
   * @example '농심)신라면(봉지)'
   */
  @IsString()
  readonly title: string;

  /**
   * 상품가격
   * @example '860'
   */
  @IsNumber()
  readonly price: number;

  /**
   * 상품 대표 이미지 url
   * @example https://www.officecon.co.kr/common/file/download?uploadFullPath=/product/20210830/20210830175629_49ef3474-8150-4271-8aba-93e769a9c8f7_V.png
   */
  @IsUrl()
  readonly image: string;

  /**
   * 상품 세부 설명
   * @example 농심)신라면(봉지)
   */
  @IsString()
  readonly detail: string;
}
