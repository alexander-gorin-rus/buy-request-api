import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserType } from './interface/user.interface';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { Token } from '../../common/decorators/token.decorator';
import { RequestService } from '../request/request.service';
import {
  DealFilterInput,
  IGetDealResponseInput,
} from '../deal/models/deal.model';
import { DealService } from '../deal/deal.service';
import {
  PageRequest,
  RequestFilterInput,
} from '../request/models/request.model';
import { IRequest } from '../request/interface/request.interface';
import {
  NotificationFilterInput,
  PageNotification,
} from '../notification/models/notification.model';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import {
  GetProductsInput,
  ProductFilterInput,
} from '../product/models/product.model';
import { GetRatingsResponse } from '../rating/models/rating.model';
import { RatingService } from '../rating/rating.service';
import { GetReportsInput } from '../report/models/report.model';
import { ReportService } from '../report/report.service';
import { OfferService } from '../deal/offer.service';
import {
  GetOffersResponseInput,
  OfferFilterInput,
} from '../deal/models/offer.model';
import { IPaginatedArray } from '../../common/types';
import { INotification } from '../notification/interface/notification.interface';
import { Client } from './models/client.model';
import { AuthService } from '../auth/auth.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    protected userService: UserService,
    protected requestService: RequestService,
    protected dealService: DealService,
    protected notificationService: NotificationService,
    protected offerService: OfferService,
    protected productService: ProductService,
    protected ratingService: RatingService,
    protected reportService: ReportService,
    protected authService: AuthService,
  ) {}

  @UseGuards(UnregisteredUserGuard)
  @Query(() => User, { name: 'user' })
  async user(
    @Token('clientAccountId') clientAccountId: string,
    @Token('userType') userType: UserType,
  ) {
    switch (userType) {
      case UserType.CONSUMER:
        return await this.userService.getConsumerByClientAccountId(
          clientAccountId,
        );
      case UserType.SELLER:
      default:
        return await this.userService.getSellerByClientAccountId(
          clientAccountId,
        );
    }
  }

  @UseGuards(UnregisteredUserGuard)
  @Query(() => Client, { name: 'client' })
  async client(@Args('userId') userId: string) {
    return await this.userService.getUserById(userId);
  }

  @ResolveField('requests', () => PageRequest, { nullable: true })
  async requests(
    @Parent() user: User,
    @Args('requestFilterInput') requestFilterInput?: RequestFilterInput,
  ): Promise<IPaginatedArray<IRequest>> {
    const { requestId, perPage, page, sort, statuses } = requestFilterInput;
    const { id: userId, clientAccountId, type: userType } = user;
    switch (userType) {
      case UserType.SELLER:
        const {
          setting: { tags },
        } = await this.userService.getSellerByClientAccountId(clientAccountId);
        return this.requestService.getRequestsByTags({
          tags,
          requestId,
          page,
          perPage,
          sort,
          statuses,
        });
      case UserType.CONSUMER:
      default:
        return await this.requestService.getRequestsByUserId({
          userId,
          requestId,
          page,
          perPage,
          sort,
          statuses,
        });
    }
  }

  @ResolveField('deals', () => IGetDealResponseInput, { nullable: true })
  async deals(
    @Parent() user: User,
    @Args('dealFilterInput') dealFilterInput?: DealFilterInput,
  ): Promise<IGetDealResponseInput> {
    const { dealId, page, perPage, sort, statuses } = dealFilterInput;
    const { id: userId } = user;
    return await this.dealService.getDeals({
      userId,
      sort,
      dealId,
      statuses,
      page,
      perPage,
    });
  }

  @ResolveField('notifications', () => PageNotification, { nullable: true })
  async notifications(
    @Parent() user: User,
    @Args('notificationsFilterInput')
    notificationsFilterInput?: NotificationFilterInput,
  ): Promise<IPaginatedArray<INotification>> {
    const { id: userId } = user;
    return await this.notificationService.getUserNotificationsByUserId({
      ...notificationsFilterInput,
      userId,
    });
  }

  @ResolveField('products', () => GetProductsInput, { nullable: true })
  async products(
    @Token('userId') userId?: string,
    @Args('productFilterInput') productFilterInput?: ProductFilterInput,
  ) {
    const { page, perPage, productId, myOwnProduct, sort } = productFilterInput;
    return await this.productService.getProducts({
      sort,
      userId: myOwnProduct ? userId : undefined,
      productId,
      page,
      perPage,
    });
  }

  @ResolveField('ratings', () => GetRatingsResponse, { nullable: true })
  async ratings(
    @Args('userId', { type: () => String }) userId: string,
    @Args('page', { nullable: true, type: () => Int }) page?: number,
    @Args('perPage', { nullable: true, type: () => Int }) perPage?: number,
  ): Promise<GetRatingsResponse> {
    return await this.ratingService.getUserRatings(userId, page, perPage);
  }

  @ResolveField('ratingsEntity', () => GetRatingsResponse, { nullable: true })
  async ratingsEntity(
    @Args('entityId', { type: () => String }) entityId: string,
  ): Promise<GetRatingsResponse> {
    return await this.ratingService.getEntityRatings(entityId);
  }

  @ResolveField('reports', () => GetReportsInput, { nullable: true })
  async reports(
    @Args('reportId', { nullable: true, type: () => String }) reportId?: string,
    @Args('page', { nullable: true, type: () => Int }) page?: number,
    @Args('perPage', { nullable: true, type: () => Int }) perPage?: number,
  ): Promise<GetReportsInput> {
    return await this.reportService.getReports({
      reportId,
      page,
      perPage,
    });
  }

  @ResolveField('offers', () => GetOffersResponseInput, { nullable: true })
  async offers(
    @Parent() user: User,
    @Args('offerFilterInput') offerFilterInput?: OfferFilterInput,
  ): Promise<GetOffersResponseInput> {
    const { offerId, page, perPage, sort, statuses } = offerFilterInput;
    const { id: userId, type: userType } = user;
    switch (userType) {
      case UserType.SELLER:
        return await this.offerService.getOffers({
          ...(!offerId ? { statuses } : {}),
          sort,
          userId,
          offerId,
          page,
          perPage,
        });
      case UserType.CONSUMER:
      default:
        const requests = await this.requestService.getRequestsByUserId({
          userId,
        });
        const requestIds = requests.data.map((request: IRequest) => request.id);
        return await this.offerService.getOffersConsumer({
          ...(!offerId ? { statuses } : {}),
          sort,
          offerId,
          requestIds,
          page,
          perPage,
        });
    }
  }
}
