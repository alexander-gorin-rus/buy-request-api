import { IFileResultInfoResponse } from 'src/modules/minio-client/interface/minio-client.interface';
import { IGetFilesRequest } from '../interface/file.interface';

export type FileResponse = {
  fileOriginalName?: string;
  fileNameMinio?: string;
  fileBuffer?: Buffer | string;
  mimetype?: string;
  resultInfo?: IFileResultInfoResponse;
};

export type ListBuckets = {
  name: string;
  creationDate: Date;
};

export type FilesDeleteRequest = IGetFilesRequest;
