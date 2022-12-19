import { IDefaultDBItem, IError } from '../../../common/types';
import { ErrorStatusRest } from '../../../common/exceptions/exception-factory/types';

export interface IUserRegisterOutput {
  clientAccountId: string;
}

export interface IUserLoginOutput {
  token?: string;
  error?: ErrorStatusRest;
}

export interface IOutput {
  isSuccess: boolean;
  error?: ErrorStatusRest;
}

export interface IJwtItem {
  key: string;
  value: any;
}

export interface INewAuth {
  clientAccountId: string;
  password: string;
  email: string;
}

export interface IAuth extends INewAuth, IDefaultDBItem {}

export interface ICommonIsSuccessResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface ICreateAuthRequest {
  email: string;
  password: string;
  name: string;
}

export interface IGetAuthRequest {
  clientAccountId?: string;
  error?: ErrorStatusRest;
}

export interface IGetAuthResponse {
  auth: IAuth | null;
  error?: IError;
}

export interface IDeleteAuthRequest {
  id: string;
}

export interface IUpdateAuthRequest {
  auth: IAuth;
}

export interface IPostAuthResponse {
  id: string;
  isSuccess: boolean;
  error?: string;
}

export interface IGoogleCaptchaOutput {
  isSuccess: boolean;
  error?: ErrorStatusRest;
}

export interface IGoogleCaptchaToken {
  captchaToken: string;
}

export type IJwtCustomParams = Array<IJwtItem>;
