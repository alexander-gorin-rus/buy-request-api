import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  ICreateDealResponse,
  IDeal,
  IUpdateDealResponse,
} from './interface/deal.interface';
import {
  Deal,
  CreateDealRequest,
  CreateDealResponse,
  UpdateDealRequest,
} from './models/deal.model';
import { DealService } from './deal.service';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { UseGuards } from '@nestjs/common';
import { Offer } from './models/offer.model';
import { OfferService } from './offer.service';
import { RequestService } from '../request/request.service';
import { GetRatingsResponse } from '../rating/models/rating.model';
import { Request } from '../request/models/request.model';
import { RatingService } from '../rating/rating.service';
import { Token } from '../../common/decorators/token.decorator';

@Resolver(() => Deal)
export class DealResolver {
  constructor(
    private dealsService: DealService,
    protected offerService: OfferService,
    protected ratingService: RatingService,
    protected requestService: RequestService,
  ) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => CreateDealResponse)
  async createDeal(
    @Args('newDeal') newDeal: CreateDealRequest,
  ): Promise<ICreateDealResponse> {
    return await this.dealsService.createDeal(newDeal);
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => CreateDealResponse)
  async updateDeal(
    @Args('deal') deal: UpdateDealRequest,
    @Token('userId') userId: string,
  ): Promise<IUpdateDealResponse> {
    return await this.dealsService.updateDeal({ deal, userId });
  }

  @ResolveField('offer', () => Offer, { nullable: true })
  async offer(@Parent() deal: IDeal): Promise<Offer> {
    const { offerId } = deal;
    const data = await this.offerService.getOffers({
      offerId,
    });
    return data.data[0];
  }

  @ResolveField('rating', () => GetRatingsResponse, { nullable: true })
  async rating(@Parent() deal: IDeal): Promise<GetRatingsResponse> {
    const { id } = deal;
    return await this.ratingService.getEntityRatings(id);
  }

  @ResolveField('request', () => Request, { nullable: true })
  async request(@Parent() deal: IDeal): Promise<Request> {
    const { requestId } = deal;
    const data = await this.requestService.getRequestsById(requestId);
    return data.data[0];
  }
}
