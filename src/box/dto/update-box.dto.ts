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
   * 박스 제작자 id(key)
   * @example 'k1804801727'
   */
  @IsOptional()
  @IsString()
  readonly ownerId?: string;
}
