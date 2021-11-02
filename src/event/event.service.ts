import {
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async joinEvent(userId: string): Promise<boolean> {
    try {
      const eventNumber = await this.checkJoinEvent();

      // 최대 이벤트 참여자 확인
      if (eventNumber >= 200)
        throw new NotAcceptableException(
          '이벤트 참여자가 초과되었습니다.',
          'Not acceptable error',
        );

      // 이벤트 참여여부 확인
      const findOne = await this.prismaService.event.findFirst({
        where: { eventId: 1, userId: userId },
      });

      //이벤트 참여한 경우
      if (findOne !== null)
        throw new ConflictException(
          '이미 해당 이벤트에 참여한 유저입니다.',
          'Conflict error',
        );

      // 이벤트 참여 기록 생성
      await this.prismaService.event.create({
        data: {
          eventId: 1,
          userId: userId,
        },
      });

      // 유저 포인트 증가
      const user = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          point: {
            increment: 3000,
          },
        },
      });

      // 포인트 증가 기록
      await this.prismaService.point.create({
        data: {
          userId: userId,
          title: '회원가입 이벤트',
          point: 3000,
          total: user.point,
          isAdd: true,
          time: new Date().toString(),
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  // 회원가입 이벤트 참여 가능 잔여 인원 확인
  async checkJoinEvent(): Promise<number> {
    return await this.prismaService.event.count({
      where: {
        eventId: 1,
      },
    });
  }

  // 설문조사 이벤트 참여 가능 잔여 인원 확인
  async checkSurveyEvent(): Promise<number> {
    return await this.prismaService.event.count({
      where: {
        eventId: 2,
      },
    });
  }

  // 설문조사 이벤트 참여 여부 확인
  async checkUserSurveyEvent(userId: string): Promise<boolean> {
    const findOne = await this.prismaService.event.findFirst({
      where: { userId: userId, eventId: 2 },
    });

    return findOne !== null;
  }

  async surveyEvent(userId: string, survey: string): Promise<boolean> {
    try {
      const eventNumber = await this.checkSurveyEvent();

      // 최대 이벤트 참여자 확인
      if (eventNumber >= 200)
        throw new NotAcceptableException(
          '이벤트 참여자가 초과되었습니다.',
          'Not acceptable error',
        );

      // 이벤트 참여 여부 확인
      const checkSurveyEvent = await this.checkUserSurveyEvent(userId);

      // 이미 이벤트 참여한 경우
      if (checkSurveyEvent)
        throw new ConflictException(
          '이미 해당 이벤트에 참여한 유저입니다.',
          'Conflict error',
        );

      // 설문 조사 내용 기록
      await this.prismaService.survey.create({
        data: {
          userId: userId,
          survey: survey,
          writeAt: new Date().toString(),
        },
      });

      // 이벤트 참여 기록 생성
      await this.prismaService.event.create({
        data: {
          eventId: 2,
          userId: userId,
        },
      });

      // 유저 포인트 증가
      const user = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          point: {
            increment: 3000,
          },
        },
      });

      // 포인트 증가 기록
      await this.prismaService.point.create({
        data: {
          userId: userId,
          title: '설문조사 이벤트',
          point: 3000,
          total: user.point,
          isAdd: true,
          time: new Date().toString(),
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
