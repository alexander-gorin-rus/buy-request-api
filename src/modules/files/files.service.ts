import { Injectable } from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import {
  FileResponse,
  FilesDeleteRequest,
  ListBuckets,
} from './types/file.types';
import {
  imageFileParams,
  videoFileParams,
  filesCount,
} from '../minio-client/constants/minio-client.constants';

import * as gm from 'gm';
import {
  IBufferedFile,
  IFileResultInfoResponse,
} from '../minio-client/interface/minio-client.interface';
import { AppMimeTypes } from '../minio-client/types/minio-client.types';

import {
  IGetFilesRequest,
  IUploadFilesRequest,
} from './interface/file.interface';
import {
  avatarImageParams,
  productImageParams,
} from '../minio-client/constants/minio-client.constants';

import { BUCKET_NAME } from './constants/file.constants';

@Injectable()
export class FilesService {
  constructor(private minioClientService: MinioClientService) {}

  async getListBuckets(): Promise<ListBuckets[]> {
    return await this.minioClientService.listBuckets();
  }

  async uploadFiles(
    files: IBufferedFile[],
    params: IUploadFilesRequest,
  ): Promise<FileResponse[] | IFileResultInfoResponse> {
    const arrayValidate = await this.checkArrayValidateFile(files);
    if (!arrayValidate.resultInfo.isSuccess) {
      return [arrayValidate];
    }
    for (const file of files) {
      if (params.bucketName === BUCKET_NAME.MESSAGE) {
        continue;
      }
      const { resultInfo } = await this.validateFile(file, params.bucketName);
      if (!resultInfo.isSuccess) {
        return resultInfo;
      }
      if (resultInfo.newFile) {
        file.buffer = resultInfo.newFile;
      }
    }
    return Promise.all(
      files.map(
        async (file) => await this.minioClientService.upload(file, params),
      ),
    );
  }

  async getFiles(query: IGetFilesRequest): Promise<FileResponse[]> {
    return Promise.all(
      JSON.parse(query.fileNamesMinio).map(
        async (fileNameMinio: string) =>
          await this.minioClientService.get({
            bucketName: query.bucketName,
            fileNameMinio,
          }),
      ),
    );
  }

  async deleteFile(query: FilesDeleteRequest): Promise<FileResponse[]> {
    return Promise.all(
      JSON.parse(query.fileNamesMinio).map(
        async (fileNameMinio: string) =>
          await this.minioClientService.delete({
            bucketName: query.bucketName,
            fileNameMinio,
          }),
      ),
    );
  }

  private async checkArrayValidateFile(
    files: IBufferedFile[],
  ): Promise<{ resultInfo: IFileResultInfoResponse }> {
    const imagesCount = files.filter((file) =>
      imageFileParams.TYPES.includes(file.mimetype.split('/')[1]),
    ).length;
    const videosCount = files.filter((file) =>
      videoFileParams.TYPES.includes(file.mimetype.split('/')[1]),
    ).length;

    try {
      if (videosCount > filesCount.VIDEO_QUANTITY) {
        throw `Maximum ${filesCount.VIDEO_QUANTITY} video files.`;
      }

      if (imagesCount > filesCount.IMAGE_QUANTITY) {
        throw `Maximum ${filesCount.IMAGE_QUANTITY} images`;
      }

      if (imagesCount + videosCount > filesCount.TOTAL) {
        throw `Maximum ${filesCount.TOTAL} files.`;
      }
      return {
        resultInfo: {
          isSuccess: true,
        },
      };
    } catch (error) {
      return {
        resultInfo: {
          isSuccess: false,
          message: error,
        },
      };
    }
  }

  private async validateFile(
    file: IBufferedFile,
    bucketName: string,
  ): Promise<{
    resultInfo: IFileResultInfoResponse;
  }> {
    if (!AppMimeTypes.find((el) => el === file.mimetype)) {
      return {
        resultInfo: {
          isSuccess: false,
          message: 'TYPE NOT INCLUDE',
        },
      };
    }

    const fileBuffer = file.buffer;
    let MAX_HEIGHT = 0;
    let MAX_WIDTH = 0;
    if (bucketName == BUCKET_NAME.AVATAR) {
      MAX_HEIGHT = avatarImageParams.HEIGHT_MAX_SIZE_PX;
      MAX_WIDTH = avatarImageParams.WIDTH_MAX_SIZE_PX;
    } else {
      MAX_HEIGHT = productImageParams.HEIGHT_MAX_SIZE_PX;
      MAX_WIDTH = productImageParams.WIDTH_MAX_SIZE_PX;
    }

    const im = gm.subClass({ imageMagick: true });

    return new Promise((resolve, reject) => {
      im(fileBuffer).identify(
        (err: unknown, value: { size: { width: number; height: number } }) => {
          if (err) reject(err);
          try {
            const inWidth = value.size.width;
            const inHeight = value.size.height;
            if (!(MAX_HEIGHT < inHeight || MAX_WIDTH < inWidth)) {
              resolve({
                resultInfo: {
                  isSuccess: true,
                },
              });
              return;
            }
            let x = 0;
            let y = 0;
            if (inWidth > inHeight) {
              x = (inWidth - inHeight) * 0.5;
            }
            if (inWidth < inHeight) {
              y = (inHeight - inWidth) * 0.5;
            }
            im(fileBuffer)
              .shave(x, y, false)
              .resize(MAX_WIDTH, MAX_HEIGHT, '^')
              .quality(1000)
              .toBuffer(function (err, buff) {
                if (err) {
                  reject(err);
                } else {
                  resolve({
                    resultInfo: {
                      isSuccess: true,
                      newFile: buff,
                    },
                  });
                }
              });
          } catch (error) {
            resolve({
              resultInfo: {
                isSuccess: false,
                message: error,
              },
            });
          }
        },
      );
    });
  }
}
