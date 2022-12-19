import { Test, TestingModule } from '@nestjs/testing';
import { CustomException } from '../custom-exceptions-factory';
import { TestCustomExceptionController } from './test-controller/test-custom-exception-controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ICustomExceptionError } from '../types';
describe('CustomException test suite', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  let controller: TestCustomExceptionController;
  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      controllers: [TestCustomExceptionController],
    }).compile();
    app = testModule.createNestApplication();
    await app.init();
    controller = app.get<TestCustomExceptionController>(
      TestCustomExceptionController,
    );
  });

  describe('Getting minimal error responce', () => {
    it('Minimal error responce has to have statusCode and message fields', () => {
      try {
        controller.getMinimalError();
      } catch (e) {
        const error: CustomException = e;
        expect(error.getStatus()).toBe(401);
        expect(error.getResponse()).toStrictEqual({
          message: 'Unregistered user',
          statusCode: 401,
        });
      }
    });
  });
  describe('Getting partial error responce', () => {
    it('Partial error responce has to have at least statusCode and message fields + some additional data', async () => {
      try {
        const responce = await request(app.getHttpServer()).get(
          '/test/custom/exception/partial',
        );
        const errorResponce: ICustomExceptionError = JSON.parse(responce.text);
        expect(errorResponce.statusCode).toBe(401);
        expect(errorResponce.message).toBeDefined();
        expect(errorResponce.data).toBeDefined();
      } catch (e) {
        expect(e).toBeNull();
      }
    });
  });
  describe('Getting full error responce', () => {
    it('Full error responce has to have statusCode and message fields + all additional data including request information', async () => {
      const responce = await request(app.getHttpServer()).get(
        '/test/custom/exception/full',
      );
      const errorResponce: ICustomExceptionError = JSON.parse(responce.text);
      expect(errorResponce.statusCode).toBe(401);
      expect(errorResponce.message).toBeDefined();
      expect(errorResponce.data).toBeDefined();
      expect(errorResponce.data.controller).toBeDefined();
      expect(errorResponce.data.handler).toBeDefined();
      expect(errorResponce.data.request).toBeDefined();
      expect(errorResponce.data.request.body).toBeDefined();
      expect(errorResponce.data.request.headers).toBeDefined();
      expect(errorResponce.data.request.hostname).toBeDefined();
      expect(errorResponce.data.request.method).toBeDefined();
      expect(errorResponce.data.request.params).toBeDefined();
      expect(errorResponce.data.request.path).toBeDefined();
      expect(errorResponce.data.request.protocol).toBeDefined();
      expect(errorResponce.data.request.query).toBeDefined();
      expect(errorResponce.data.request.url).toBeDefined();
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
