import { Observable } from 'rxjs';
import {
  IDefaultDBItem,
  IError,
  IPaginatedArray,
  ISort,
} from '../../../common/types';

export interface IRequestServiceClient {
  createRequest(
    locale: string,
    request: ICreateRequestRequest,
  ): Observable<ICreateRequestResponse>;

  getRequestsByUserId(
    userId: string,
    requestId?: string,
    page?: number,
    perPage?: number,
  ): Observable<IPaginatedArray<IRequest>>;
  getRequestsByTags(
    tags: string[],
    requestId?: string,
    page?: number,
    perPage?: number,
  ): Observable<IPaginatedArray<IRequest>>;
}

export interface INewRequest {
  description: string;
  budget: number;
  tags: string[];
  userId: string;
  products: string[];
  isDraft: boolean;
  readyForAnalogues: boolean;
  cover: string;
  title: string;
  delete?: boolean;
}

export enum RequestStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  DEFAULT_IN_PROGRESS = 'DEFAULT_IN_PROGRESS',
  DISABLE = 'DISABLE',
  DELETEABLE = 'DELETEABLE',
}

export interface IRequest extends INewRequest, IDefaultDBItem {}

export type ICreateRequestRequest = INewRequest;

export type updateRequestRequest = Partial<IRequest>;

export interface IGetRequestsByUserId {
  sort?: ISort[];
  statuses?: RequestStatus[];
  userId?: string;
  requestId?: string;
  page?: number;
  perPage?: number;
}

export interface IGetRequestsByTags {
  statuses?: RequestStatus[];
  sort?: ISort[];
  tags: string[];
  requestId?: string;
  page?: number;
  perPage?: number;
}

export interface ICommonIsSuccessResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface IMedia {
  fileOriginalName: string;
  fileNameMinio: string;
  mimetype: string;
  bucket: typeof bucketType;
}

const bucketType = {
  REQUEST: 'request',
  PRODUCT: 'product',
};

export type ICreateRequestResponse = ICommonIsSuccessResponse;
