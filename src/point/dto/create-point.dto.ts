import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePointDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly title: string;

  @IsNumber()
  readonly point: number;

  @IsNumber()
  readonly total: number;

  @IsBoolean()
  readonly isAdd: boolean;

  @IsString()
  readonly time: string;
}
