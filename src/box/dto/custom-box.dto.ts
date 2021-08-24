import { IsNumber } from 'class-validator';

export class CustomBoxDto {
  /**
   * 받을 결과의 개수 / 생략 불가능
   * @example 5
   */
  @IsNumber()
  readonly take: number;
}
