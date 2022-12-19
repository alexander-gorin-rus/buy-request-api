import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import {
  ICommonIsSuccessResponse,
  ICreateRequestRequest,
  IGetRequestsByTags,
  IGetRequestsByUserId,
  IRequest,
  IRequestServiceClient,
  updateRequestRequest,
} from './interface/request.interface';
import configuration from '../../config/configuration';
import { IPaginatedArray } from '../../common/types';

const {
  packageNames: { REQUEST_PACKAGE },
} = configuration();

@Injectable()
export class RequestService extends GrpcRequestService implements OnModuleInit {
  private requestService: IRequestServiceClient;

  constructor(
    @Inject(REQUEST_PACKAGE.name) private requestClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(requestClient);
  }

  onModuleInit(): void {
    this.requestService = this.requestClient.getService<IRequestServiceClient>(
      this.configService.get('packageNames').REQUEST_PACKAGE.packageName,
    );
  }

  async createRequest(
    locale: string,
    request: ICreateRequestRequest,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.getResponse<
      ICommonIsSuccessResponse,
      IRequestServiceClient,
      { locale: string; request: ICreateRequestRequest }
    >(this.requestService, 'createRequest', {
      locale,
      request,
    });
  }

  async updateRequest(
    request: updateRequestRequest,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.getResponse<
      ICommonIsSuccessResponse,
      IRequestServiceClient,
      { request: updateRequestRequest }
    >(this.requestService, 'updateRequest', {
      request,
    });
  }

  async getRequestsByUserId(
    requests: IGetRequestsByUserId,
  ): Promise<IPaginatedArray<IRequest>> {
    const result = await this.getResponse<
      IPaginatedArray<IRequest>,
      IRequestServiceClient,
      IGetRequestsByUserId
    >(this.requestService, 'getRequestsByUserId', requests);
    return { ...result, data: result.data || [] };
  }

  async getRequestsById(requestId: string): Promise<IPaginatedArray<IRequest>> {
    const result = await this.getResponse<
      IPaginatedArray<IRequest>,
      IRequestServiceClient,
      IGetRequestsByUserId
    >(this.requestService, 'getRequestsById', {
      requestId,
    });
    return { ...result, data: result.data || [] };
  }

  async getRequestsByTags(
    requests: IGetRequestsByTags,
  ): Promise<IPaginatedArray<IRequest>> {
    const result = await this.getResponse<
      IPaginatedArray<IRequest>,
      IRequestServiceClient,
      IGetRequestsByTags
    >(this.requestService, 'getRequestsByTags', requests);
    return { ...result, data: result.data || [] };
  }
}
