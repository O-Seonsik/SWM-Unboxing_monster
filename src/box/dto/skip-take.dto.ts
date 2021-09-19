import { IsNumber, IsOptional } from 'class-validator';

export class SkipTakeDto {
  /**
   * 건너뛸 결과의 개수 / 생략시 0
   * @example 5
   */
  @IsOptional()
  @IsNumber()
  readonly skip?: number;

  /**
   * 받을 결과의 개수 / 생략시 skip 이후부터 끝까지 받음
   * @example 5
   */
  @IsOptional()
  @IsNumber()
  readonly take?: number;
}
