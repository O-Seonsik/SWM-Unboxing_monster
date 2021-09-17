import { IsBoolean, IsNumber, IsString } from 'class-validator';

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

  /**
   * 박스 대표 이미지 url
   * @example 'https://test.com/resource/test.png
   */
  @IsString()
  readonly image: string;

  /**
   * 대상 이미지의 위치가 로컬이면 True
   * @example true
   */
  @IsBoolean()
  readonly isLocal: boolean;
  /**
   * 박스 세부 설명
   * @example '한우 박스입니다. 풀내음이 가득한 박스지요!'
   */
  @IsString()
  readonly detail: string;
}
