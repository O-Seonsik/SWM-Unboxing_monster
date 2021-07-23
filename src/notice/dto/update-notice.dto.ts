import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticeDto } from './create-notice.dto';
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {
  /**
   * 공지사항 이미지의 URL
   * @example 'https://imgsrc.com/img.png'
   */
  @IsUrl()
  @IsOptional()
  readonly imgUrl: string;

  /**
   * 공지사항 내용 redirect 될 URL
   * @example 'https://notice.com/notice/1'
   */
  @IsUrl()
  @IsOptional()
  readonly srcUrl: string;
}
