import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { CustomException } from '../../custom-exceptions-factory';

@Controller('test/custom/exception/')
export class TestCustomExceptionController {
  @Get('minimal')
  getMinimalError(): string {
    throw new CustomException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unregistered user',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  @Get('partial')
  getPartialError(@Req() request: Request): string {
    const requestDataForError = {
      body: request.body,
      cookies: request.cookies,
      query: request.query,
      url: request.url,
    };
    const additionalErrorData = {
      controller: 'TestCustomExceptionController',
      request: requestDataForError,
      date: new Date(Date.now()),
    };
    throw new CustomException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unregistered user',
        data: additionalErrorData,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  @Get('full')
  getFullError(@Req() request: Request): string {
    const requestDataForError = {
      body: request.body,
      cookies: request.cookies,
      headers: request.headers,
      hostname: request.hostname,
      method: request.method,
      params: request.params,
      path: request.path,
      protocol: request.protocol,
      query: request.query,
      url: request.url,
    };
    const additionalErrorData = {
      controller: 'TestCustomExceptionController',
      handler: 'getFullError',
      request: requestDataForError,
      date: new Date(Date.now()),
    };
    throw new CustomException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unregistered user',
        data: additionalErrorData,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
