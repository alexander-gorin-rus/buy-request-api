import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestControllerScopedUnregisteredUserGuard } from './test-endpoint/test-controller-scoped-guard';
import * as request from 'supertest';
import { ICustomExceptionError } from '../../exceptions/exception-factory/types';
import { UnregisteredUserGuard } from './unregistered-user-guard';

describe('Test Controller Scoped UnregisteredUserGuard', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      controllers: [TestControllerScopedUnregisteredUserGuard],
    }).compile();
    app = testModule.createNestApplication();
    await app.init();
  });

  describe('Controller Scoped Guard', () => {
    it('A guard should be applied to the whole controller"', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        TestControllerScopedUnregisteredUserGuard,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(UnregisteredUserGuard);
    });

    it('A guard should return a custom error if there is no valid token in request coockies', async () => {
      const responce = await request(app.getHttpServer()).get(
        '/test/controller/scoped/unregistered/user/guard',
      );
      const errorResponce: ICustomExceptionError = JSON.parse(responce.text);
      expect(errorResponce.statusCode).toBe(401);
      expect(errorResponce.message).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
