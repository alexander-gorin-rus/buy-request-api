import { Observable } from 'rxjs';
import { IDefaultDBItem, IError, ISort } from '../../../common/types';

export enum EDealStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  CUSTOMER_PAID = 'CUSTOMER_PAID',
  DISPUTE = 'DISPUTE',
}

export interface IDealServiceClient {
  createDeal(deal: IDeal): Observable<ICreateDealResponse>;
  getDeals(data: { userId: string; dealId?: string }): Observable<IDeal[]>;
}

export interface IDeal extends IDefaultDBItem {
  requestId: string;
  offerId: string;
  sellerId: string;
  consumerId: string;
  status?: EDealStatus;
  additionalConditions: string;
  expiratedAt?: string;
}

export interface IGetDialResponse {
  deal: IDeal;
  error?: IError;
}

export interface ICreateDealRequest {
  requestId: string;
  offerId: string;
  status?: EDealStatus;
  additionalConditions?: string;
  sellerId: string;
  consumerId: string;
  expiratedAt?: string;
}

export interface ICreateDealResponse {
  isSuccess: boolean;
  id?: string;
  error?: IError;
}

export interface IUpdateDealRequest {
  deal: IUpdateDeal;
  userId: string;
}

export interface IUpdateDeal {
  id: string;
  status: EDealStatus;
  additionalConditions?: string;
}

export interface IUpdateDealResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface IGetDealsRequest {
  sort?: ISort[];
  userId: string;
  dealId?: string;
  statuses?: EDealStatus[];
  page?: number;
  perPage?: number;
}
