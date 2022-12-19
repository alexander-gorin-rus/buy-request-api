import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export interface ICustomExceptionError {
  statusCode: HttpStatus;
  message: string;
  data?: AdditionalErrorData;
}

export type CustomExceptionCode = Partial<Omit<ICustomExceptionError, 'data'>>;

interface AdditionalErrorData {
  controller?: string;
  handler?: string;
  request?: RequestDataForErrorData;
  date?: Date;
}

interface RequestDataForErrorData {
  body?: Request['body'];
  cookies?: Request['cookies'];
  headers?: Request['headers'];
  hostname?: Request['hostname'];
  method?: Request['method'];
  params?: Request['params'];
  path?: Request['path'];
  protocol?: Request['protocol'];
  query?: Request['query'];
  url?: Request['url'];
}

export enum ErrorStatusRest {
  USER_EXIST = 'USER_EXIST',
  USER_NOT_EXIST = 'USER_NOT_EXIST',
  PASSWORD_ERROR = 'PASSWORD_ERROR',
  INVALID_SIGN = 'INVALID SIGNATURE JWT',
  EMAIL_IS_NOT_VERIFIED = 'EMAIL_IS_NOT_VERIFIED',
  EMAIL_IS_ALREADY_VERIFIED = 'EMAIL_IS_ALREADY_VERIFIED',
  INCORRECT_CODE = 'INCORRECT_CODE',
  NO_ONE_TIME_CODE = 'NO_ONE_TIME_CODE',
  CODE_ALREADY_GENERATED = 'CODE_ALREADY_GENERATED',
  CODE_TIMEOUT = 'CODE_TIMEOUT',
  CAPTCHA_TOKEN_NOT_VERIFIED = 'CAPTCHA_TOKEN_NOT_VERIFIED',
}

export enum ErrorStatusGrpc {
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  ACCESS_TOKEN_NOT_FOUND = 'ACCESS_TOKEN_NOT_FOUND',
}
