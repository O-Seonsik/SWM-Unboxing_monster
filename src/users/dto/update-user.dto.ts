import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * User's email
   * @example "email@mail.com"
   */
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  /**
   * Points that users have
   * @example 5000
   */
  @IsNumber()
  @IsOptional()
  readonly point?: number;

  /**
   * 사용자의 닉네임
   * @example 왕자
   */
  @IsNumber()
  @IsOptional()
  readonly nickname?: string;
}
