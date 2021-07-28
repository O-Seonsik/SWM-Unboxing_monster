import { PartialType } from '@nestjs/mapped-types';
import { CreateBoxDto } from './create-box.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBoxDto extends PartialType(CreateBoxDto) {
  /**
   * 상품명
   * @example '최고급 한우'
   */
  @IsOptional()
  @IsString()
  readonly title?: string;

  /**
   * 상품가격
   * @example '20000'
   */
  @IsOptional()
  @IsNumber()
  readonly price?: number;

  /**
   * 박스 대표 이미지 url
   * @example 'https://test.com/resource/test.png
   */
  @IsOptional()
  @IsString()
  readonly image: string;

  /**
   * 박스 세부 설명
   * @example '한우 박스입니다. 풀내음이 가득한 박스지요!'
   */
  @IsString()
  readonly detail: string;
}
