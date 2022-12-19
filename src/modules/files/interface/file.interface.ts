import {
  IBufferedFile,
  IFileResultInfoResponse,
} from 'src/modules/minio-client/interface/minio-client.interface';

export interface IUploadFilesRequest {
  bucketName: string;
}

export interface IGetFilesRequest {
  fileNamesMinio: string;
  bucketName: string;
}

export interface IFilesCheck {
  (files: IBufferedFile[]): { resultInfo: IFileResultInfoResponse };
}

export interface ImageCheck {
  (file: IBufferedFile, bucketName: string): Promise<{
    resultInfo: IFileResultInfoResponse;
  }>;
}

export interface validateCheck {
  (file: IBufferedFile, bucketName: string): Promise<{
    resultInfo: IFileResultInfoResponse;
  }>;
}
