import { Test } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { UserService } from './user.service';
import configuration from '../../config/configuration';
import { ClientsModule } from '@nestjs/microservices';
import { IConsumer, ISeller, UserType } from './interface/user.interface';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const { clients } = configuration();
    const testModule = await Test.createTestingModule({
      providers: [UserService, ConfigService],
      imports: [ClientsModule.register(clients)],
    }).compile();

    userService = testModule.get<UserService>(UserService);
  });

  test('should return consumer', async () => {
    const result: IConsumer = {
      id: uuid(),
      clientAccountId: uuid(),
      userName: 'username',
      name: 'name',
      surname: 'surname',
      phone: '12345678911',
      email: 'email',
      createdAt: '000',
      updatedAt: '000',
      type: UserType.CONSUMER,
      requests: [],
      deals: [],
      avatar: 'avatar-consumer',
      locale: 'RU',
    };
    jest
      .spyOn(userService, 'getConsumerByClientAccountId')
      .mockImplementation(() => new Promise((resolve) => resolve(result)));

    return expect(
      await userService.getConsumerByClientAccountId(result.clientAccountId),
    ).toBe(result);
  });

  test('should return updated consumer', async () => {
    const clientAccountId = uuid();
    const newConsumer: IConsumer = {
      id: uuid(),
      clientAccountId,
      userName: 'username',
      name: 'name',
      surname: 'surname',
      phone: '12345678911',
      email: 'email',
      createdAt: '000',
      updatedAt: '000',
      type: UserType.CONSUMER,
      requests: [],
      deals: [],
      avatar: 'avatar-consumer',
      locale: 'RU',
    };
    const result = {
      user: newConsumer,
    };

    jest
      .spyOn(userService, 'updateConsumer')
      .mockImplementation(() => new Promise((resolve) => resolve(result)));

    return expect(
      await userService.updateConsumer(newConsumer, clientAccountId),
    ).toBe(result);
  });

  test('should return updated seller', async () => {
    const clientAccountId = uuid();
    const newSeller: ISeller = {
      id: uuid(),
      clientAccountId,
      userName: 'username',
      name: 'name',
      surname: 'surname',
      phone: '12345678911',
      email: 'email',
      createdAt: '000',
      updatedAt: '000',
      type: UserType.SELLER,
      company: 'UIT',
      requests: [],
      deals: [],
      setting: { tags: [], emails: true },
      avatar: 'avatar-seller',
    };
    const result = {
      user: newSeller,
    };

    jest
      .spyOn(userService, 'updateSeller')
      .mockImplementation(() => new Promise((resolve) => resolve(result)));

    return expect(
      await userService.updateSeller(newSeller, clientAccountId),
    ).toBe(result);
  });
});
