import { Observable } from 'rxjs';
import {
  DataArray,
  IDefaultDBItem,
  IError,
  IPageInfo,
} from '../../../common/types';

export interface IFeedbackServiceClient {
  createRating(rating: IRating): Observable<ICreateRatingResponse>;
  getRatings(data: { entityId: string }): Observable<DataArray<IRating>>;
}

export enum entityNames {
  DEAL = 'DEAL',
  PRODUCT = 'PRODUCT',
}

export interface IRating extends IDefaultDBItem {
  entityId: string;
  entityName: entityNames;
  authorId: string;
  value: number;
  comment?: string;
}

export interface ICreateRatingRequest {
  entityId: string;
  entityName: string;
  authorId: string;
  value: number;
  comment?: string;
}

export interface ICreateRatingResponse {
  isCreated: boolean;
  error?: IError;
}

export type GetRatingsRequest =
  | {
      entityId: string;
    }
  | {
      userId: string;
      page?: number;
      perPage?: number;
    };

export interface IGetUserRatingResponse {
  userRating: number;
  data: IRating[];
  pageInfo: IPageInfo;
  error?: IError;
}
