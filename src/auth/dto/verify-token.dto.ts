import { IsString } from 'class-validator';

export class VerifyTokenDto {
  /**
   * User's social
   * @example "kakao | facebook | apple"
   */
  @IsString()
  readonly co: string;
}
