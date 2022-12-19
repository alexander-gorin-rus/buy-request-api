import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { CustomException } from '../../exceptions/exception-factory/custom-exceptions-factory';

export const checkIfThereIsATokenInCookies = (request: Request) => {
  if (request.cookies && request.cookies.token) return true;
  throw new CustomException(
    {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unregistered user',
    },
    HttpStatus.UNAUTHORIZED,
  );
};
