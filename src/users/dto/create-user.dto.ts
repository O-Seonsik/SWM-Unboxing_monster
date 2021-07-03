import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly nickname: string;
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly pass: string;
  @IsPhoneNumber('KR')
  readonly phone: string;
}
