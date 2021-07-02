import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  nickname: string;
  @IsString()
  email: string;
  @IsString()
  pass: string;
  @IsString()
  phone: string;
}
