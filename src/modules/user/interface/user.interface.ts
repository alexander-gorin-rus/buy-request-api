import { Observable } from 'rxjs';
import { IRequest } from '../../request/interface/request.interface';
import { IDeal } from '../../deal/interface/deal.interface';
import { IDefaultDBItem, IError } from '../../../common/types';

export interface IUserServiceClient {
  getUserByClientAccountId(data: {
    clientAccountId: string;
  }): Observable<IGetUserByClientAccountIdResponse<IUser>>;
  getUserById(data: {
    userId: string;
  }): Observable<IGetCommonUserResponse<ISeller | IConsumer>>;
  getConsumerByClientAccountId(data: {
    clientAccountId: string;
  }): Observable<IGetUserByClientAccountIdResponse<IConsumer>>;
  getSellerByClientAccountId(data: {
    clientAccountId: string;
  }): Observable<IGetUserByClientAccountIdResponse<ISeller>>;
  getSellersByTag(tag: string): Observable<IGetListResponse<ISeller[]>>;
  registerConsumer(data: IConsumer): Observable<IRegisterUserResponse>;
  registerSeller(data: ISeller): Observable<IRegisterUserResponse>;
  updateConsumer(
    data: IUpdateConsumerRequest,
  ): Observable<IUpdateUserResponse<IConsumer>>;
  updateSeller(
    data: IUpdateSellerRequest,
  ): Observable<IUpdateUserResponse<ISeller>>;
  updateSellerSetting(
    data: IUpdateSellerSettingRequest,
  ): Observable<IUpdateSellerSettingResponse>;
}

export enum UserType {
  SELLER = 'SELLER',
  CONSUMER = 'CONSUMER',
}

export interface IUser extends IDefaultDBItem {
  clientAccountId: string;
  type: UserType;
  email: string;
  name: string;
  surname: string;
  userName: string;
  phone: string;
  avatar?: string;
  locale?: LocaleTypes;
}

export type LocaleTypes = 'RU' | 'EN';

export interface IConsumer extends IUser {
  requests: IRequest[];
  deals: IDeal[];
}

export interface ISeller extends IUser {
  company: string;
  requests: IRequest[];
  deals: IDeal[];
  setting: ISellerSetting;
}

export interface IGetCommonUserResponse<U> {
  user: U;
  error?: IError;
}

export type IGetUserByClientAccountIdResponse<U> = IGetCommonUserResponse<U>;

export interface IRegisterUserRequest {
  email: string;
  type: UserType;
  password?: string;
  clientAccountId: string;
  name: string;
  surname: string;
  userName: string;
  phone: string;
  locale?: LocaleTypes;
}

export type IRegisterConsumerRequest = IRegisterUserRequest;

export interface IRegisterSellerRequest extends IRegisterUserRequest {
  company: string;
}

export type IRegisterUserResponse = ICommonIsSuccessResponse;

export interface ICommonIsSuccessResponse {
  isSuccess: boolean;
  error?: string;
}

export interface IUpdateConsumerRequest {
  clientAccountId: string;
  surname: string;
  name: string;
  phone: string;
  userName: string;
  avatar?: string;
  locale?: LocaleTypes;
}

export interface IUpdateSellerRequest {
  clientAccountId: string;
  surname: string;
  name: string;
  phone: string;
  userName: string;
  company: string;
  avatar?: string;
  locale?: LocaleTypes;
}

export interface IUpdateUserResponse<U> {
  user?: U;
  error?: IError;
}

export interface ISellerSetting {
  tags?: string[];
  emails?: boolean;
}

export interface ISellerSettingResponse extends ISellerSetting {
  id: string;
}

export interface IUpdateSellerSettingRequest {
  setting: ISellerSetting;
  userId: string;
}

export interface IUpdateSellerSettingResponse {
  setting: ISellerSettingResponse;
  error?: IError;
}

export interface IGetListResponse<R> {
  list: R;
  error?: IError;
}
