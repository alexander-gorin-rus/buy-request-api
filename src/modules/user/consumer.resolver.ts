import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Consumer,
  UpdateConsumerRequest,
  UpdateConsumerResponse,
} from './models/user.model';
import { UserService } from './user.service';
import { RequestService } from '../request/request.service';
import { DealService } from '../deal/deal.service';
import { UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { IConsumer, IUpdateUserResponse } from './interface/user.interface';
import { Token } from '../../common/decorators/token.decorator';
import { UserResolver } from './user.resolver';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { RatingService } from '../rating/rating.service';
import { ReportService } from '../report/report.service';
import { OfferService } from '../deal/offer.service';
import { AuthService } from '../auth/auth.service';
import { GraphQLError } from 'graphql';

@Resolver(() => Consumer)
export class ConsumerResolver extends UserResolver {
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
  ) {
    super(
      userService,
      requestService,
      dealService,
      notificationService,
      offerService,
      productService,
      ratingService,
      reportService,
      authService,
    );
  }

  @UseGuards(UnregisteredUserGuard)
  @Query(() => Consumer, { name: 'consumer' })
  async consumer(@Token('clientAccountId') clientAccountId: string) {
    return await this.userService.getConsumerByClientAccountId(clientAccountId);
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => UpdateConsumerResponse)
  async updateConsumer(
    @Token('clientAccountId') clientAccountId: string,
    @Args('params') params: UpdateConsumerRequest,
  ): Promise<IUpdateUserResponse<IConsumer>> {
    const { oldPassword, newPassword, email } = params;
    if ((oldPassword && newPassword) || email) {
      const resetPasswordOrEmail =
        await this.authService.changeAuthPasswordOrEmail(
          clientAccountId,
          {
            oldPassword,
            newPassword,
          },
          email,
        );
      if (!resetPasswordOrEmail.isSuccess) {
        throw new GraphQLError(resetPasswordOrEmail.error);
      }
    }
    return await this.userService.updateConsumer(params, clientAccountId);
  }
}
