import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
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
   * 상품 대표 이미지 url
   * @example 'https://test.com/resource/test.png
   */
  @IsOptional()
  @IsString()
  readonly image?: string;
  /**
   * 상품 세부 설명
   * @example '최고급 한우입니다. 풀을 많이 먹고 자라서 그런지 풀맛이 나요'
   */
  @IsOptional()
  @IsString()
  readonly detail?: string;
}
