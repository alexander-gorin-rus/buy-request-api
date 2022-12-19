import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import configuration from '../../config/configuration';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import { ConfigService } from '@nestjs/config';
import {
  ICreateTagResponse,
  ITag,
  ITagServiceClient,
} from './interface/tag.interface';
import { DataArray } from '../../common/types';

const {
  packageNames: { PRODUCT_PACKAGE },
} = configuration();

@Injectable()
export class TagService extends GrpcRequestService implements OnModuleInit {
  private tagService: ITagServiceClient;

  constructor(
    @Inject(PRODUCT_PACKAGE.name) private tagClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(tagClient);
  }

  onModuleInit(): any {
    this.tagService = this.tagClient.getService<ITagServiceClient>(
      this.configService.get('packageNames').PRODUCT_PACKAGE.packageName,
    );
  }

  async createTag(
    titleRu: string,
    titleEn: string,
    name: string,
  ): Promise<ICreateTagResponse> {
    return await this.getResponse<ICreateTagResponse, ITagServiceClient, any>(
      this.tagService,
      'createTag',
      {
        tag: {
          titleEn,
          titleRu,
          name,
        },
      },
    );
  }

  async getTags(tagId?: string): Promise<DataArray<ITag>> {
    return await this.getResponse<DataArray<ITag>, ITagServiceClient, any>(
      this.tagService,
      'getTags',
      {
        tagId,
      },
    );
  }
}
