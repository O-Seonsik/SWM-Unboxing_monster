import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AppleTokenDto {
  /**
   * 로그인시 발급받은 code
   * @example 'c3a623a25ad174e3fa950f40d21068833.0.rrzy.kSsxRKGIVPU3lPYnXCSXmg'
   */
  @IsString()
  readonly code: string;

  /**
   * 안드로이드인 경우 true
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  readonly isAndroid?: boolean;
}
