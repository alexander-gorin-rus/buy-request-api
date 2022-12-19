import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import {
  IRegisterConsumerRequest,
  IRegisterSellerRequest,
  IRegisterUserResponse,
  LocaleTypes,
  UserType,
} from '../user/interface/user.interface';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  IGoogleCaptchaOutput,
  IGoogleCaptchaToken,
  IOutput,
} from './interface/auth.inteface';
import { TokenService } from './token.service';
import configuration from '../../config/configuration';
import { Cookie } from '../../common/decorators/cookie.decorator';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { Token } from '../../common/decorators/token.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  IChangePasswordInput,
  ILoginUserInput,
  IRegisterUserInput,
  IResendAuthEmailInput,
  IResetPasswordConfirmInput,
  IResetPasswordInput,
  IVerifyEmailInput,
} from './dto/auth.dto';

const { cookieDomain } = configuration();

@ApiTags('user')
@Controller('user')
export class AuthController {
  private oldCookieAttributes = {
    maxAge: -1,
    httpOnly: true,
    secure: false, //remove after tests
    domain: cookieDomain,
  };

  private cookieAttributes: CookieOptions = {
    httpOnly: true,
    secure: false, //remove after tests
    domain: cookieDomain,
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  private async clearCookies(
    res,
    name = 'token',
    options = this.oldCookieAttributes,
  ) {
    return res.clearCookie(name, options);
  }

  private async setCookie(
    res: Response,
    token,
    name = 'token',
    options: CookieOptions = this.cookieAttributes,
  ) {
    return res.cookie(name, token, options);
  }

  @Post('/sign-up')
  async signUp(
    @Body() body: IRegisterUserInput,
    @Cookie('locale') locale: LocaleTypes = 'RU',
  ): Promise<IRegisterUserResponse> {
    const { type } = body;
    const { clientAccountId, error } = await this.authService.signUp({
      ...body,
      locale,
    });
    if (error) {
      return { isSuccess: false, error: error };
    }
    switch (type) {
      case UserType.SELLER:
        const seller: IRegisterSellerRequest = {
          name: body.name,
          surname: body.surname,
          phone: body.phone,
          userName: body.userName,
          company: body.company,
          email: body.email,
          type: body.type,
          clientAccountId,
          locale,
        };
        return await this.userService.registerSeller(seller);
      case UserType.CONSUMER:
      default:
        const consumer: IRegisterConsumerRequest = {
          name: body.name,
          surname: body.surname,
          phone: body.phone,
          userName: body.userName,
          email: body.email,
          type: body.type,
          clientAccountId,
          locale,
        };
        return await this.userService.registerConsumer(consumer);
    }
  }

  @Post('/sign-in')
  async signIn(
    @Body() body: ILoginUserInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IOutput> {
    const { email, password } = body;
    const { token, error } = await this.authService.signIn(email, password);

    if (error) {
      response.json({
        isSuccess: false,
        error,
      });
      return;
    }

    const clientAccountId =
      this.tokenService.getClientAccountIdFromToken(token);
    const { type, id } = await this.userService.getUserByClientAccountId(
      clientAccountId,
    );
    const newToken = this.tokenService.createCustomJwt(
      token,
      {
        key: 'userType',
        value: type,
      },
      {
        key: 'userId',
        value: id,
      },
    );
    const res = await this.setCookie(response, newToken);
    res.json({
      isSuccess: true,
    });
    return;
  }

  @UseGuards(UnregisteredUserGuard)
  @Post('/change-password')
  async changePassword(
    @Body() body: IChangePasswordInput,
    @Res() response,
    @Token('clientAccountId') id: string,
  ): Promise<IOutput> {
    const res = await this.authService.changePassword(id, body);
    await response.json(res);
    return;
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() body: IResetPasswordInput,
    @Res() response,
    @Cookie('locale') locale = 'RU',
  ): Promise<IOutput> {
    const res = await this.authService.resetPassword(body, locale);
    await response.json(res);
    return;
  }

  @Post('/resend-email-auth')
  async resendEmailAuth(
    @Body() body: IResendAuthEmailInput,
    @Res() response,
  ): Promise<IOutput> {
    const res = await this.authService.resendEmailAuth(body);
    await response.json(res);
    return;
  }

  @Post('/reset-password-confirm')
  async resetPasswordConfirm(
    @Body() body: IResetPasswordConfirmInput,
    @Res() response,
    @Cookie('locale') locale = 'RU',
  ): Promise<IOutput> {
    const res = await this.authService.resetPasswordConfirm(body, locale);
    await response.json(res);
    return;
  }

  @Post('/verify-email')
  async verifyEmail(
    @Body() body: IVerifyEmailInput,
    @Res() response,
  ): Promise<IOutput> {
    const res = await this.authService.verifyEmail(body);
    await response.json(res);
    return;
  }

  @UseGuards(UnregisteredUserGuard)
  @Post('/logout')
  async logout(@Res() response): Promise<IOutput> {
    const res = await this.clearCookies(response);
    await res.json({
      isSuccess: true,
    });
    return;
  }

  @Post('/captcha')
  async verifyGoogleCaptchaToken(
    @Body() captchaToken: IGoogleCaptchaToken,
    @Res() response,
  ): Promise<IGoogleCaptchaOutput> {
    const res = await this.authService.verifyGoogleCaptchaToken(captchaToken);
    await response.json(res);
    return;
  }
}
