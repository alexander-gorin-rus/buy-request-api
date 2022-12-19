import { Observable } from 'rxjs';
import {
  IDefaultDBItem,
  IError,
  IPaginatedArray,
  ISort,
} from '../../../common/types';
import { IDeal } from './deal.interface';

export enum EOfferStatus {
  CANCELED_BY_CONSUMER = 'CANCELED_BY_CONSUMER',
  CANCELED_BY_SELLER = 'CANCELED_BY_SELLER',
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  CREATED = 'CREATED',
  IN_DEAL = 'IN_DEAL',
  IS_HOLD = 'IS_HOLD',
}

export interface IOfferServiceClient {
  createOffer(request: ICreateOfferRequest): Observable<ICreateOfferResponse>;
  getOffers(request: IGetOffersRequest): Observable<IPaginatedArray<IOffer>>;
  updateOffer(request: IUpdateOfferRequest): Observable<IUpdateOfferResponse>;
  deleteOffer(request: IDeleteOfferRequest): Observable<IDeleteOfferResponse>;
  getOffersConsumer(
    request: IGetOffersConsumerRequest,
  ): Observable<IPaginatedArray<IOffer>>;
}

export interface INewOffer {
  userId: string;
  requestId: string;
  productId: string;
  price: number;
  description: string;
  ecogood: boolean;
  isDraft: boolean;
  status: EOfferStatus;
  additionalConditions?: string;
  media?: IMedia[];
  cover?: string;
  title?: string;
  deal?: IDeal;
}

export interface IMedia {
  fileOriginalName: string;
  fileNameMinio: string;
  mimetype: string;
  bucket: typeof bucketType;
}

const bucketType = {
  OFFER: 'offer',
  PRODUCT: 'product',
};

export interface IOffer extends INewOffer, IDefaultDBItem {}

export interface ICreateOfferRequest {
  offer: INewOffer;
}
export interface ICreateOfferResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface IGetOffersRequest {
  statuses?: EOfferStatus[];
  sort?: ISort[];
  userId?: string;
  offerId?: string;
  page?: number;
  perPage?: number;
}

export interface IUpdateOffer {
  id: string;
  status?: EOfferStatus;
  isDraft?: boolean;
  additionalConditions?: string;
  description?: string;
  price?: number;
  cover?: string;
  media?: IMedia[];
  title?: string;
}

export interface IUpdateOfferRequest {
  offer: IUpdateOffer;
}

export interface IUpdateOfferResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface IDeleteOfferRequest {
  id: string;
}
export interface IDeleteOfferResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface IGetOffersConsumerRequest {
  status?: EOfferStatus;
  sort?: ISort[];
  offerId?: string;
  requestIds: string[];
  page?: number;
  perPage?: number;
}
