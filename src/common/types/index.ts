export enum ContextTypes {
  HTTP = 'http',
  GQL = 'graphql',
  RPC = 'rpc',
}

export interface IError {
  code: string;
  message: Array<string>;
}

export interface IPageInfo {
  page: number;
  perPage: number;
  totalCount: number;
  totalPageCount: number;
}

export interface IPaginatedArray<T> {
  data?: T[] | [];
  pageInfo: IPageInfo;
}

export type DataArray<T> = Omit<IPaginatedArray<T>, 'pageInfo'>;

export interface IIsSuccessResponse {
  isSuccess: boolean;
}

export interface IDefaultDBItem {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISort {
  orderBy: string;
  orderName: string;
}
