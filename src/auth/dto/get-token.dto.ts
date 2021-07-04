import { IsEmail, IsString } from 'class-validator';

export class GetTokenDto {
  /**
   * User's email
   * @example dhtjstlr777@gmail.com
   */
  @IsEmail()
  readonly email: string;
  /**
   * User's password
   * @example test
   */
  @IsString()
  readonly pass: string;
}
