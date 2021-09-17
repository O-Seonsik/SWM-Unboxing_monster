import { IsEmail, IsString } from 'class-validator';

export class JoinUnboxingDto {
  /**
   * 유저의 email
   * @example 'test@mail.com'
   */
  @IsEmail()
  readonly email: string;

  /**
   * 유저의 닉네임
   * @example '왕자'
   */
  @IsString()
  readonly nickname: string;
}
