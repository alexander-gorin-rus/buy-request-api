import { Observable } from 'rxjs';
import {
  IDefaultDBItem,
  IError,
  IPaginatedArray,
  ISort,
} from '../../../common/types';

export interface IProductServiceClient {
  createProduct(
    request: ICreateProductRequest,
  ): Observable<ICommonIsSucessResponse>;

  deleteProduct(
    request: IDeleteProductRequest,
  ): Observable<ICommonIsSucessResponse>;

  updateProduct(
    request: IUpdateProductRequest,
  ): Observable<ICommonIsSucessResponse>;

  getProducts(
    request: IGetProductsRequest,
  ): Observable<IPaginatedArray<IProduct>>;
}

export enum ProductStatus {
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  ON_MODERATION = 'ON_MODERATION',
}

export interface ICommonIsSucessResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface IMedia {
  fileOriginalName: string;
  mimetype: string;
  fileNameMinio: string;
}
export interface INewProduct {
  userId: string;
  production: string;
  name: string;
  model: string;
  tags: string[];
  productionGuarantee: string;
  description: string;
  media: IMedia[];
  cover: string;
  status?: ProductStatus;
}

export interface IProduct extends INewProduct, IDefaultDBItem {}

export interface ICreateProductRequest {
  product: INewProduct;
}

export interface IGetProductsRequest {
  sort?: ISort[];
  userId?: string;
  productId?: string;
  page?: number;
  perPage?: number;
  status?: string;
}

export interface IGetProductsForOfferRequest {
  sort?: ISort[];
  tagNames: string[];
  productIds: string[];
  page?: number;
  perPage?: number;
}

export interface IDeleteProductRequest {
  id: string;
}

export interface IUpdateSettings {
  id: string;
  name: string;
  description: string;
  tags: string[];
  model: string;
  productionGuarantee: string;
  production: string;
  status?: ProductStatus;
  media?: IMedia[];
  cover: string;
}

export interface IUpdateProductRequest {
  product: IUpdateSettings;
}
