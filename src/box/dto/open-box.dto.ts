import { IsNumber, IsOptional } from 'class-validator';

export class OpenBoxDto {
  /**
   * 오픈할 상자의 개수를 입력합니다. 미입력시 1
   * @example 3
   */
  @IsOptional()
  @IsNumber()
  readonly count?: number;
}
