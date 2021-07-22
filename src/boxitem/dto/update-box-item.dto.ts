import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBoxItemDto {
  /**
   * Box ID(primary)
   * @example 1242321
   */
  @IsOptional()
  @IsNumber()
  readonly boxId?: number;

  /**
   * Item ID(primary)
   * @example 1242321
   */
  @IsOptional()
  @IsNumber()
  readonly itemId?: number;
}
