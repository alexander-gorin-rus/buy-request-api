import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ICustomExceptionError } from './types';
import { HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(error: ICustomExceptionError, status: HttpStatus) {
    super(error, status);
  }
}
