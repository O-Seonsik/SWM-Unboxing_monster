import { IsUrl } from 'class-validator';

export class CreateNoticeDto {
  /**
   * 공지사항 이미지의 URL
   * @example 'https://imgsrc.com/img.png'
   */
  @IsUrl()
  readonly imgUrl: string;

  /**
   * 공지사항 내용 redirect 될 URL
   * @example 'https://notice.com/notice/1'
   */
  @IsUrl()
  readonly srcUrl: string;
}
