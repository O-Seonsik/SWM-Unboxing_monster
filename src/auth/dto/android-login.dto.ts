import { IsBoolean, IsOptional } from 'class-validator';

export class AndroidLoginDto {
  /**
   * 안드로이드인 경우 true
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  readonly isAndroid?: boolean;
}
