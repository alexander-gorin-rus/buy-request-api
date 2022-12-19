import { UserType } from '../../../modules/user/interface/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class IResetPasswordInput {
  @ApiProperty({
    required: true,
    description: 'Email',
    example: 'email@mail.com',
  })
  email: string;
}

export class IResendAuthEmailInput {
  @ApiProperty({
    required: true,
    description: 'Email',
    example: 'email@mail.com',
  })
  email: string;
}

export class IVerifyEmailInput {
  @ApiProperty({
    required: true,
    description: 'id from email link',
    example: '8c122a95101b2ffce587ef7f7',
  })
  id: string;
}

export class IResetPasswordConfirmInput {
  @ApiProperty({
    required: true,
    description: 'Новый закодированный пароль',
    example: '8c122a95101b2ffce587ef7f7da616582baadd33c6209ec738f92793c70032e4',
  })
  newPassword: string;

  @ApiProperty({
    required: true,
    description: 'Код из сообщения присланного на почту',
    example: 'ABC123',
  })
  code: string;

  @ApiProperty({
    required: true,
    description: 'Email',
    example: 'email@mail.com',
  })
  email: string;
}

export class ILoginUserInput {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;
}

export class IChangePasswordInput {
  @ApiProperty({
    required: true,
    description: 'Старый закодированный пароль',
    example: '8c122a95101b2ffce587ef7f7da616582baadd33c6209ec738f92793c70032e4',
  })
  oldPassword: string;

  @ApiProperty({
    required: true,
    description: 'Новый закодированный пароль',
    example: '8c122a95101b2ffce587ef7f7da616582baadd33c6209ec738f92793c70032e4',
  })
  newPassword: string;
}

export class IRegisterUserInput {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  surname: string;

  @ApiProperty({ required: true })
  userName: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({ required: true })
  company: string;

  @ApiProperty({ required: true })
  type: UserType;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: false })
  locale?: string;
}

export class IVerifyGoogleCaptchaInput {
  @ApiProperty({
    required: true,
    description: 'Валидация гугл капчи',
    example: 'isSuccess: true',
  })
  captcha: string;
}
