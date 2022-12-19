import { Test } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import configuration from '../../config/configuration';
import { ClientsModule } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  IUserLoginOutput,
  IUserRegisterOutput,
} from './interface/auth.inteface';
import { UserType } from '../user/interface/user.interface';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { IRegisterUserInput } from './dto/auth.dto';

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const { clients } = configuration();
    const testModule = await Test.createTestingModule({
      providers: [AuthService, UserService, ConfigService, TokenService],
      controllers: [AuthController],
      imports: [ClientsModule.register(clients), HttpModule],
    }).compile();

    authService = testModule.get<AuthService>(AuthService);
  });

  describe('SignUp', () => {
    test('should return clientAccountId', async () => {
      const req: IRegisterUserInput = {
        name: 'test name',
        surname: 'test surname',
        userName: 'test userName',
        email: 'email@mail.ru',
        phone: '89998887766',
        type: UserType.CONSUMER,
        password: '123456',
        company: 'Company Inc',
      };
      const res: IUserRegisterOutput = {
        clientAccountId: uuid(),
      };
      jest
        .spyOn(authService, 'signUp')
        .mockImplementation(() => new Promise((resolve) => resolve(res)));

      return expect(await authService.signUp(req)).toBe(res);
    });
  });

  describe('SignIn', () => {
    test('should return token', async () => {
      const email = 'email@mail.ru';
      const password = '123456';
      const res: IUserLoginOutput = {
        token: uuid(),
      };
      jest
        .spyOn(authService, 'signIn')
        .mockImplementation(() => new Promise((resolve) => resolve(res)));

      return expect(await authService.signIn(email, password)).toBe(res);
    });
  });
});
