import { Injectable } from '@nestjs/common';
import {
  IOutput,
  IGetAuthRequest,
  IPostAuthResponse,
  IUserLoginOutput,
  IGoogleCaptchaOutput,
  IGoogleCaptchaToken,
} from './interface/auth.inteface';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import configuration from '../../config/configuration';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ErrorStatusRest } from '../../common/exceptions/exception-factory/types';
import {
  IChangePasswordInput,
  IRegisterUserInput,
  IResendAuthEmailInput,
  IResetPasswordConfirmInput,
  IResetPasswordInput,
  IVerifyEmailInput,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly authUrl: string;
  private readonly captchaSecretKey: string;
  private googleCaptchaUrl: string;
  constructor(private httpService: HttpService) {
    this.authUrl = configuration().authUrl;
    this.captchaSecretKey = configuration().googleCaptchaSecretKey;
    this.googleCaptchaUrl = configuration().googleCaptchaUrl;
  }

  async signUp(newUser: IRegisterUserInput): Promise<IGetAuthRequest> {
    const result = await this.createAuth(newUser);
    if (result.error) {
      return { error: ErrorStatusRest[result.error] };
    }
    if (result.isSuccess || result.id) {
      return { clientAccountId: result.id };
    }
  }

  private async createAuth(
    newUser: IRegisterUserInput,
  ): Promise<IPostAuthResponse> | never {
    const { email, name, password, locale } = newUser;
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + '/auth/sign-up', {
            email,
            name,
            password,
            locale,
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  private async getAuth(
    email: string,
    password: string,
  ): Promise<IUserLoginOutput> | never {
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + '/auth/sign-in', { email, password })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  async signIn(email: string, password: string): Promise<IUserLoginOutput> {
    const result = await this.getAuth(email, password);
    if (result.error) {
      return { error: ErrorStatusRest[result.error] };
    }
    if (result.token) {
      return { token: result.token };
    }
  }

  async changeAuthPasswordOrEmail(
    id: string,
    passwordChange?: IChangePasswordInput,
    email?: string,
  ) {
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + '/auth/change-password-or-email', {
            id,
            passwordChange,
            email,
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  async changePassword(
    id: string,
    request: IChangePasswordInput,
  ): Promise<IOutput> {
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + `/auth/change-password`, {
            ...request,
            id,
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  async resetPassword(
    request: IResetPasswordInput,
    locale: string,
  ): Promise<IOutput> {
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + `/auth/reset-password`, {
            ...request,
            locale,
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  async resendEmailAuth(request: IResendAuthEmailInput): Promise<IOutput> {
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + `/auth/resend-email-auth`, {
            ...request,
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  async verifyEmail(request: IVerifyEmailInput): Promise<IOutput> {
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + `/auth/verify-email`, request)
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  async resetPasswordConfirm(
    request: IResetPasswordConfirmInput,
    locale: string,
  ): Promise<IOutput> {
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.authUrl + `/auth/reset-password-confirm`, {
            ...request,
            locale,
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }

  async verifyGoogleCaptchaToken(
    captchaToken: IGoogleCaptchaToken,
  ): Promise<IGoogleCaptchaOutput> {
    const secretKey = this.captchaSecretKey;
    try {
      return await lastValueFrom(
        this.httpService
          .post(this.googleCaptchaUrl + '/api/siteverify', {
            secret: secretKey,
            response: captchaToken,
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }
}
