import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  /**
   * User's token it doesn't have bearer
   * @example "asd132fd2j3l3df3aslk234asdf"
   */
  @IsString()
  readonly token: string;
  /**
   * User's email
   * @example "email@mail.com"
   */
  @IsEmail()
  readonly email: string;
  /**
   * User's social
   * @example "kakao | facebook | apple"
   */
  // @IsString()
  @IsEnum(['kakao', 'facebook', 'apple'])
  readonly co: string;
}
