import { IsEmail, IsString } from 'class-validator';

export class GetTokenDto {
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly pass: string;
}
