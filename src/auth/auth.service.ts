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
import { fbConfig, appleConfig } from './constants';
import { createClientSecret } from 'apple-id-client-secret';
import verifyAppleToken from 'verify-apple-id-token';
import { AppleTokenDto } from './dto/apple-token.dto';

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
      const id = userInfo.data.id;

      if (!id) throw new BadRequestException();
      const user = await this.usersService.getUser({ id: 'k' + id });
      if (!user) throw new NotFoundException();

      const payload = { useremail: user.email, sub: user.id };
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

  async kakaoJoin(token: string, email: string, nickname: string) {
    try {
      const userInfo = await this.httpService
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: 'Bearer ' + token },
        })
        .toPromise();
      const id = userInfo.data.id;
      if (!id) throw new BadRequestException();
      return await this.usersService.createUser('k' + id, email, nickname);
    } catch (error) {
      if (
        error.response.error === 'PRIMARY' ||
        error.response.statusCode === 403
      )
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

      const id = userInfo.data.data.user_id;
      if (!id) throw new BadRequestException();
      const user = await this.usersService.getUser({ id: 'f' + id });
      if (!user) throw new NotFoundException();
      const payload = { useremail: user.email, sub: user.id };
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

  async facebookJoin(token: string, email: string, nickname: string) {
    try {
      const access_token = await this.getFbAccessToken();
      const userInfo = await this.httpService
        .get(
          `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${access_token}`,
        )
        .toPromise();
      const id = userInfo.data.data.user_id;
      if (!id) throw new BadRequestException();
      return await this.usersService.createUser('f' + id, email, nickname);
    } catch (error) {
      if (
        error.response.error === 'PRIMARY' ||
        error.response.statusCode === 403
      )
        throw new ConflictException('The id is already registered');
      throw new BadRequestException(
        'The token is not available',
        'BadRequestException',
      );
    }
  }

  async getAppleToken(q: AppleTokenDto) {
    const clientId = q.isAndroid ? appleConfig.android : appleConfig.client_id;

    const clientSecret = createClientSecret({
      keyId: appleConfig.keyId,
      bundleId: clientId,
      teamId: appleConfig.teamId,
      privateKey: appleConfig.privateKey,
    });

    const data = new URLSearchParams();

    data.append('client_id', clientId);
    data.append('grant_type', 'authorization_code');
    data.append('client_secret', clientSecret);
    data.append('redirect_uri', appleConfig.redirect_uri);
    data.append('code', q.code);

    try {
      const response = await this.httpService
        .post('https://appleid.apple.com/auth/token', data)
        .toPromise();

      return response.data.refresh_token;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async appleTokenValidate(refresh_token, isAndroid?: boolean) {
    const clientId = isAndroid ? appleConfig.android : appleConfig.client_id;
    const clientSecret = createClientSecret({
      keyId: appleConfig.keyId,
      bundleId: clientId,
      teamId: appleConfig.teamId,
      privateKey: appleConfig.privateKey,
    });

    const data = new URLSearchParams();

    data.append('client_id', clientId);
    data.append('grant_type', 'refresh_token');
    data.append('client_secret', clientSecret);
    data.append('redirect_uri', appleConfig.redirect_uri);
    data.append('refresh_token', refresh_token);

    try {
      const response = await this.httpService
        .post('https://appleid.apple.com/auth/token', data)
        .toPromise();

      const jwtClaims = await verifyAppleToken({
        idToken: response.data.id_token,
        clientId: clientId,
      });
      return jwtClaims.sub;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async appleLogin(refresh_token: string, isAndroid?: boolean) {
    try {
      const id = await this.appleTokenValidate(refresh_token, isAndroid);
      if (!id) throw new BadRequestException();
      const user = await this.usersService.getUser({ id: 'a' + id });
      if (!user) throw new NotFoundException();

      const payload = { useremail: user.email, sub: user.id };
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

  async appleJoin(
    refresh_token: string,
    email: string,
    nickname: string,
    isAndroid?: boolean,
  ) {
    try {
      const id = await this.appleTokenValidate(refresh_token, isAndroid);
      return await this.usersService.createUser('a' + id, email, nickname);
    } catch (error) {
      console.log(error);
      if (
        error.response.error === 'PRIMARY' ||
        error.response.statusCode === 403
      )
        throw new ConflictException('The id is already registered');
      throw new BadRequestException(
        'The token is not available',
        'BadRequestException',
      );
    }
  }
}
