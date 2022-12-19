import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Delete,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { schemaFormData } from './constants/file.constants';
import { FileResponse, ListBuckets } from './types/file.types';
import {
  IBufferedFile,
  IFileResultInfoResponse,
} from '../minio-client/interface/minio-client.interface';
import {
  FileUploadInput,
  FilesGetInput,
  FilesDeleteInput,
} from './dto/files.dto';
import { FilesService } from './files.service';

@ApiTags('file')
@Controller('file')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('get-list-buckets')
  async getListBackets(): Promise<ListBuckets[]> {
    return await this.filesService.getListBuckets();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody(schemaFormData)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<IBufferedFile>,
    @Query() params: FileUploadInput,
  ): Promise<FileResponse[] | IFileResultInfoResponse> {
    return await this.filesService.uploadFiles(files, params);
  }

  @Get()
  async getFiles(@Query() query: FilesGetInput): Promise<FileResponse[]> {
    return await this.filesService.getFiles(query);
  }

  @Delete()
  async deleteFile(@Query() query: FilesDeleteInput): Promise<FileResponse[]> {
    return await this.filesService.deleteFile(query);
  }
}
