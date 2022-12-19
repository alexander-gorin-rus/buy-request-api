import { Observable } from 'rxjs';
import {
  DataArray,
  IDefaultDBItem,
  IError,
  IIsSuccessResponse,
} from '../../../common/types';

export interface ITagServiceClient {
  createTag(data: ICreateTagRequest): Observable<ICreateTagResponse>;
  getTags(tagId?: string): Observable<DataArray<ITag>>;
}

export interface ITag extends IDefaultDBItem {
  name: string;
  title: string;
}

export interface INewTag {
  name: string;
  titleRu: string;
  titleEn: string;
}

export interface ICreateTagRequest {
  tag: INewTag;
}

export interface ICreateTagResponse extends IIsSuccessResponse {
  error?: IError;
}

export interface IGetTagsRequest {
  tagId?: string;
}

export interface IGetTagsResponse {
  tags: ITag[];
  error?: IError;
}
