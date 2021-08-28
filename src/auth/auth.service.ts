import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { fbConfig } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(token: string) {
    try {
      const userInfo = await this.httpService
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: 'Bearer ' + token },
        })
        .toPromise();
      const email = userInfo.data.kakao_account.email;
      const id = 'k' + userInfo.data.id;
      const payload = { useremail: email, sub: id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error.response.error === 'PRIMARY')
        throw new ConflictException('The id is already registered');
      throw new BadRequestException(
        'The token is not available',
        'BadRequestException',
      );
    }
  }

  async kakaoJoin(token: string, email: string) {
    try {
      const userInfo = await this.httpService
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: 'Bearer ' + token },
        })
        .toPromise();
      const id = 'k' + userInfo.data.id;
      return await this.usersService.createUser(id, email);
    } catch (error) {
      if (error.response.error === 'PRIMARY')
        throw new ConflictException('The id is already registered');
      throw new BadRequestException(
        'The token is not available',
        'BadRequestException',
      );
    }
  }

  async getFbAccessToken() {
    try {
      const token = await this.httpService
        .get(
          `https://graph.facebook.com/oauth/access_token?client_id=${fbConfig.client_id}&client_secret=${fbConfig.client_secret}&grant_type=client_credentials`,
        )
        .toPromise();
      return token.data.access_token;
    } catch (error) {
      throw new InternalServerErrorException('fb_server_error');
    }
  }

  async facebookLogin(token: string) {
    try {
      const access_token = await this.getFbAccessToken();
      const userInfo = await this.httpService
        .get(
          `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${access_token}`,
        )
        .toPromise();

      const id = 'f' + userInfo.data.data.user_id;
      if (!id) throw new BadRequestException();

      const user = await this.usersService.getUser({ id: id });
      console.log(user);
      if (!user) throw new NotFoundException();
      const payload = { useremail: user.email, sub: id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.log(error);
      if (error.response.error === 'PRIMARY')
        throw new ConflictException('The id is already registered');
      else if (error.response.statusCode === 404)
        throw new NotFoundException('You can use it after sign up');
      throw new BadRequestException(
        'The token is not available',
        'BadRequestException',
      );
    }
  }

  async facebookJoin(token: string, email: string) {
    try {
      const access_token = await this.getFbAccessToken();
      const userInfo = await this.httpService
        .get(
          `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${access_token}`,
        )
        .toPromise();
      const id = 'f' + userInfo.data.data.user_id;
      if (!id) throw new BadRequestException();
      return await this.usersService.createUser(id, email);
    } catch (error) {
      if (error.response.error === 'PRIMARY')
        throw new ConflictException('The id is already registered');
      throw new BadRequestException(
        'The token is not available',
        'BadRequestException',
      );
    }
  }
}
