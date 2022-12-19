import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './models/notification.model';
import { UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { IsSuccessResponse } from '../../common/models';
import { IIsSuccessResponse } from '../../common/types';
import { RequestService } from '../request/request.service';
import { OfferService } from '../deal/offer.service';
import { DealService } from '../deal/deal.service';
import {
  notificationSubject,
  notificationTypeToSubject,
} from './interface/notification.interface';
import { Token } from '../../common/decorators/token.decorator';
import { Deal } from '../deal/models/deal.model';
import { Offer } from '../deal/models/offer.model';
import { Request } from '../request/models/request.model';
import { GetIdsInput } from './dto/input/set-notifications-by-id';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly requestService: RequestService,
    private readonly offerService: OfferService,
    private readonly dealService: DealService,
  ) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async setNotificationsRead(
    @Args('ids') ids: GetIdsInput,
  ): Promise<IIsSuccessResponse> {
    return await this.notificationService.setNotificationIsRead(ids);
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async setNotificationsArchive(
    @Args('ids') ids: GetIdsInput,
  ): Promise<IIsSuccessResponse> {
    return await this.notificationService.setNotificationIsArchive(ids);
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async setAllNotificationsArchive(
    @Token('userId') userId: string,
  ): Promise<IIsSuccessResponse> {
    return await this.notificationService.setAllNotificationIsArchive({
      userId,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async setAllNotificationsIsRead(
    @Token('userId') userId: string,
  ): Promise<IIsSuccessResponse> {
    return await this.notificationService.setAllNotificationIsRead({
      userId,
    });
  }

  @ResolveField('deal', () => [Deal], { nullable: true })
  async deal(
    @Parent() notification: Notification,
    @Token('userId') userId: string,
  ): Promise<Deal[] | []> {
    const { subjectId, type } = notification;
    if (notificationTypeToSubject[type] == notificationSubject.DEAL) {
      const deal = await this.dealService.getDeals({
        dealId: subjectId,
        userId,
      });
      return deal.data;
    }
    return [];
  }

  @ResolveField('request', () => [Request], { nullable: true })
  async request(@Parent() notification: Notification): Promise<Request[] | []> {
    const { subjectId, type } = notification;
    if (notificationTypeToSubject[type] === notificationSubject.REQUEST) {
      const request = await this.requestService.getRequestsById(subjectId);
      return request.data;
    }
    return [];
  }

  @ResolveField('offer', () => [Offer], { nullable: true })
  async offer(@Parent() notification: Notification): Promise<Offer[] | []> {
    const { subjectId, type } = notification;
    if (notificationTypeToSubject[type] === notificationSubject.OFFER) {
      const offer = await this.offerService.getOffers({
        offerId: subjectId,
      });
      return offer.data;
    }
    return [];
  }
}
