import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  /**
   * nickname
   * @example prince
   */
  @IsString()
  readonly nickname: string;
  /**
   * email address like example
   * @example test@mail.com
   */
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly pass: string;
  /**
   * the phone number has hyphen(-)
   * @example 010-1234-5678
   */
  @IsPhoneNumber('KR')
  readonly phone: string;
}
