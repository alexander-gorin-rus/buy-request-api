import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import { IPaginatedArray } from '../../common/types';
import configuration from '../../config/configuration';
import {
  ICreateOfferRequest,
  ICreateOfferResponse,
  IDeleteOfferRequest,
  IDeleteOfferResponse,
  IGetOffersConsumerRequest,
  IGetOffersRequest,
  IOffer,
  IOfferServiceClient,
  IUpdateOfferRequest,
  IUpdateOfferResponse,
} from './interface/offer.interface';

const {
  packageNames: { DEAL_PACKAGE },
} = configuration();

@Injectable()
export class OfferService extends GrpcRequestService implements OnModuleInit {
  private offerService: IOfferServiceClient;

  constructor(@Inject(DEAL_PACKAGE.name) private offerClient: ClientGrpc) {
    super(offerClient);
  }

  onModuleInit(): void {
    this.offerService = this.offerClient.getService<IOfferServiceClient>(
      DEAL_PACKAGE.packageName,
    );
  }
  async createOffer(
    request: ICreateOfferRequest,
  ): Promise<ICreateOfferResponse> {
    return await this.getResponse<
      ICreateOfferResponse,
      IOfferServiceClient,
      ICreateOfferRequest
    >(this.offerService, 'createOffer', request);
  }
  async getOffers(
    request: IGetOffersRequest,
  ): Promise<IPaginatedArray<IOffer>> {
    const result = await this.getResponse<
      IPaginatedArray<IOffer>,
      IOfferServiceClient,
      IGetOffersRequest
    >(this.offerService, 'getOffers', request);
    return { ...result, data: result.data || [] };
  }
  async getOffersConsumer(
    request: IGetOffersConsumerRequest,
  ): Promise<IPaginatedArray<IOffer>> {
    const result = await this.getResponse<
      IPaginatedArray<IOffer>,
      IOfferServiceClient,
      IGetOffersConsumerRequest
    >(this.offerService, 'getOffersConsumer', request);
    return { ...result, data: result.data || [] };
  }
  async updateOffer(
    request: IUpdateOfferRequest,
  ): Promise<IUpdateOfferResponse> {
    return await this.getResponse<
      IUpdateOfferResponse,
      IOfferServiceClient,
      IUpdateOfferRequest
    >(this.offerService, 'updateOffer', request);
  }
  async deleteOffer(
    request: IDeleteOfferRequest,
  ): Promise<IDeleteOfferResponse> {
    return await this.getResponse<
      IDeleteOfferResponse,
      IOfferServiceClient,
      IDeleteOfferRequest
    >(this.offerService, 'deleteOffer', request);
  }
}
