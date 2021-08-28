import { IsEmail } from 'class-validator';

export class JoinUnboxingDto {
  /**
   * 유저의 email
   * @example 'test@mail.com'
   */
  @IsEmail()
  readonly email: string;
}
