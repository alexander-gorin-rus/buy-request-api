import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ICreateDealRequest,
  ICreateDealResponse,
  IDeal,
  IDealServiceClient,
  IGetDealsRequest,
  IUpdateDealRequest,
  IUpdateDealResponse,
} from './interface/deal.interface';
import configuration from '../../config/configuration';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import { IPaginatedArray } from '../../common/types';
import { EOfferStatus } from './interface/offer.interface';
import { OfferService } from './offer.service';

const {
  packageNames: { DEAL_PACKAGE },
} = configuration();

@Injectable()
export class DealService extends GrpcRequestService implements OnModuleInit {
  private dealService: IDealServiceClient;

  constructor(
    @Inject(DEAL_PACKAGE.name) private userClient: ClientGrpc,
    protected offerService: OfferService,
  ) {
    super(userClient);
  }

  onModuleInit(): any {
    this.dealService = this.userClient.getService<IDealServiceClient>(
      DEAL_PACKAGE.packageName,
    );
  }

  async createDeal(deal: ICreateDealRequest): Promise<ICreateDealResponse> {
    const result = await this.getResponse<
      ICreateDealResponse,
      IDealServiceClient,
      any
    >(this.dealService, 'createDeal', {
      deal,
    });
    if (result.isSuccess) {
      const offerResult = await this.offerService.updateOffer({
        offer: {
          id: deal.offerId,
          status: EOfferStatus.CONFIRMED,
        },
      });
      if (offerResult.isSuccess) {
        return result;
      }
    }
    return { ...deal, isSuccess: false };
  }

  async updateDeal(request: IUpdateDealRequest): Promise<IUpdateDealResponse> {
    return await this.getResponse<
      IUpdateDealResponse,
      IDealServiceClient,
      IUpdateDealRequest
    >(this.dealService, 'updateDeal', request);
  }

  async getDeals(data: IGetDealsRequest): Promise<IPaginatedArray<IDeal>> {
    const result = await this.getResponse<
      IPaginatedArray<IDeal>,
      IDealServiceClient,
      IGetDealsRequest
    >(this.dealService, 'getDeals', data);
    return { ...result, data: result.data || [] };
  }
}
