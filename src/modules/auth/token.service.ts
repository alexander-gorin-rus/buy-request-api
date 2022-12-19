import { HttpException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IJwtCustomParams } from './interface/auth.inteface';
import { ConfigService } from '@nestjs/config';
import { ErrorStatusRest } from '../../common/exceptions/exception-factory/types';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  private decodeToken(token: string): jwt.JwtPayload | string {
    try {
      jwt.verify(token, this.configService.get('jwtSecretKey'));
      return jwt.decode(token);
    } catch (e) {
      throw new HttpException(ErrorStatusRest.INVALID_SIGN, 401);
    }
  }

  private encodeToken(payload: any): string {
    return jwt.sign(payload, this.configService.get('jwtSecretKey'));
  }

  getClientAccountIdFromToken(token: string): string {
    const payload = this.decodeToken(token);
    return payload['id'].toString();
  }

  createCustomJwt(token: string, ...params: IJwtCustomParams): string {
    const authTokenPayload = this.decodeToken(token);
    const newTokenPayload = {
      email: authTokenPayload['email'],
      emailVerified: true,
      clientAccountId: authTokenPayload['id'],
      ...(params &&
        params.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {})),
    };
    return this.encodeToken(newTokenPayload);
  }
}
