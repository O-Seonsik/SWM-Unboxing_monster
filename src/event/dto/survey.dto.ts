import { IsString } from 'class-validator';

export class SurveyDto {
  /**
   * 설문 조사 결과를 스트링으로 변환한 결과
   * @example "1: asfdsfda, 2:[1, 2, 3]"
   */
  @IsString()
  readonly survey: string;
}
