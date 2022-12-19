import {
  IFileResultInfoResponse,
  IGetFileRequest,
} from '../interface/minio-client.interface';

export type AppMimeType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/bmp'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-msvideo';

export type FileResponse = {
  fileOriginalName?: string;
  fileNameMinio?: string;
  fileBuffer?: Buffer | string;
  mimetype?: string;
  resultInfo?: IFileResultInfoResponse;
};

export const AppMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/bmp',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
];

export type FileDeleteRequest = IGetFileRequest;
