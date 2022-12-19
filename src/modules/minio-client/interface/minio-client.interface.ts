import { AppMimeType } from '../types/minio-client.types';
import { imageErrorType } from '../constants/minio-client.constants';

export interface IUploadFileRequest {
  bucketName: string;
}

export interface IGetFileRequest {
  bucketName: string;
  fileNameMinio: string;
}

export interface IFileResultInfoResponse {
  isSuccess: boolean;
  message?: string;
  error?: typeof imageErrorType;
  newFile?: Buffer;
}

export interface IBufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer;
}

export interface IFileCheck {
  (file: IBufferedFile):
    | Promise<IFileResultInfoResponse>
    | IFileResultInfoResponse;
}
