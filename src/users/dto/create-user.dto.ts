import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  /**
   * User's email
   * @example "email@mail.com"
   */
  @IsEmail()
  readonly email: string;
  /**
   * User's social id
   * @example "144243143234"
   */
  @IsString()
  readonly id: string;

  /**
   * User's nickname
   * @example "왕자"
   */
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;
}
