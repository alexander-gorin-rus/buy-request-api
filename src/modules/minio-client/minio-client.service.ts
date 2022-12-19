import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import {
  IFileResultInfoResponse,
  IGetFileRequest,
  IUploadFileRequest,
} from './interface/minio-client.interface';
import {
  imageFileParams,
  imageErrorType,
  typesFile,
  videoFileParams,
  quantities,
  widthRage,
  heightRange,
} from './constants/minio-client.constants';

import { ListBuckets } from '../files/types/file.types';
import { FileDeleteRequest, FileResponse } from './types/minio-client.types';
import { IBufferedFile } from './interface/minio-client.interface';
import * as gm from 'gm';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger(MinioService.name);
  }

  async listBuckets(): Promise<ListBuckets[]> {
    try {
      return await this.client.listBuckets();
    } catch (err) {
      return err.message;
    }
  }

  private async videoCheck(
    file: IBufferedFile,
  ): Promise<IFileResultInfoResponse> {
    const fileBuffer = file.buffer;
    const start = fileBuffer.indexOf(Buffer.from('mvhd')) + 17;
    const timeScale = fileBuffer.readUInt32BE(start);
    const inDuration =
      (Math.floor(fileBuffer.readUInt32BE(start + 4)) / timeScale) * 1000;

    try {
      if (file.size > videoFileParams.MAX_FILE_SIZE_MIN_BYTES) {
        throw `The file size must not exceed ${
          videoFileParams.MAX_FILE_SIZE_MIN_BYTES / quantities.BYTES
        } megabytes.`;
      }
      if (inDuration > videoFileParams.DURATION_MAX_MULLTISECONDS) {
        throw `Video length must be no more than ${
          videoFileParams.DURATION_MAX_MULLTISECONDS / quantities.MULLTISECONDS
        } minutes.`;
      }
      return {
        isSuccess: true,
        message: 'File uploaded.',
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error,
      };
    }
  }

  private async fileIdentify(
    file: IBufferedFile,
  ): Promise<IFileResultInfoResponse> {
    const mimeTypeFile = typesFile.find((type) => file.mimetype.includes(type));

    if (!mimeTypeFile) {
      return {
        isSuccess: false,
        message: `Format must be ${typesFile}.`,
      };
    }

    if (videoFileParams.TYPES.includes(mimeTypeFile)) {
      return this.videoCheck(file);
    }

    if (imageFileParams.TYPES.includes(mimeTypeFile)) {
      return this.imageCheck(file);
    }

    return {
      isSuccess: false,
      message: `${
        file.originalname.split('.')[1]
      } format is not registered yet.`,
    };
  }

  public async upload(
    file: IBufferedFile,
    params: IUploadFileRequest,
  ): Promise<FileResponse> {
    const resultInfo = await this.fileIdentify(file);

    if (!resultInfo.isSuccess) {
      return {
        fileOriginalName: file.originalname,
        resultInfo,
      };
    }

    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData: any = {
      'Content-Type': file.mimetype,
    };
    const fileOriginalName = hashedFileName + ext;
    const fileNameMinio: string | number = `${fileOriginalName}`;
    const fileBuffer = file.buffer;
    this.client.putObject(
      params.bucketName,
      fileNameMinio,
      fileBuffer,
      metaData,
      (err) => {
        if (err)
          throw new HttpException(
            'Error uploading file.',
            HttpStatus.BAD_REQUEST,
          );
      },
    );

    return {
      fileOriginalName: file.originalname,
      fileNameMinio,
      mimetype: file.mimetype,
      resultInfo,
    };
  }

  async get(data: IGetFileRequest): Promise<FileResponse> {
    try {
      const getUserFile = (fileNameMinio: string) => ({
        fileNameMinio,
      });
      const fileBuffer = await (
        await this.client.getObject(data.bucketName, data.fileNameMinio)
      ).read();

      return {
        ...getUserFile(data.fileNameMinio),
        fileBuffer,
      };
    } catch (error) {
      return {
        resultInfo: {
          isSuccess: false,
          message: error.message,
        },
      };
    }
  }

  async delete(data: FileDeleteRequest): Promise<FileResponse> {
    try {
      await this.client.removeObject(data.bucketName, data.fileNameMinio);
      return {
        resultInfo: {
          isSuccess: true,
          message: 'Removed the object.',
        },
      };
    } catch (error) {
      return {
        resultInfo: {
          isSuccess: false,
          message: error.message,
        },
      };
    }
  }

  private async imageCheck(
    file: IBufferedFile,
  ): Promise<IFileResultInfoResponse> {
    const fileBuffer = file.buffer;
    return new Promise((resolve, reject) => {
      const im = gm.subClass({ imageMagick: true });
      im(fileBuffer).identify(
        (err: unknown, value: { size: { width: number; height: number } }) => {
          if (err) reject(err);
          const inFileSize = file.size;
          const inWidth = value.size.width;
          const inHeight = value.size.height;
          try {
            if (inFileSize > imageFileParams.FILE_SIZE_MAX_BYTES) {
              throw imageErrorType.MAX_FILE_SIZE;
            }
            if (widthRage[0] > inWidth || widthRage[1] < inWidth) {
              throw imageErrorType.MAX_FILE_PX_RANGE;
            }
            if (heightRange[0] > inHeight || heightRange[1] < inHeight) {
              throw imageErrorType.MAX_FILE_PX_RANGE;
            }
            resolve({
              isSuccess: true,
            });
          } catch (error) {
            resolve({
              isSuccess: false,
              error: error,
            });
          }
        },
      );
    });
  }
}
