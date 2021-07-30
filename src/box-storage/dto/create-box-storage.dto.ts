import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBoxStorageDto {
  /**
   * 박스 구매 후 보유중인 회원의 ID
   * @example f123234523
   */
  @IsString()
  readonly ownerId: string;

  /**
   * 구매한 박스의 ID
   * @example 23241
   */
  @IsNumber()
  readonly boxId: number;

  /**
   * 구매한 상자의 개수(동일한 박스에 대해서만)
   * @example 5
   */
  @IsOptional()
  @IsNumber()
  readonly count?: number;
}
