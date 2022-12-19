import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Seller,
  UpdateSellerRequest,
  UpdateSellerResponse,
  UpdateSellerSettingRequest,
} from './models/user.model';
import { UserService } from './user.service';
import { RequestService } from '../request/request.service';
import { DealService } from '../deal/deal.service';
import { UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import {
  ICommonIsSuccessResponse,
  ISeller,
  IUpdateUserResponse,
} from './interface/user.interface';
import { Token } from '../../common/decorators/token.decorator';
import { UserResolver } from './user.resolver';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { RatingService } from '../rating/rating.service';
import { ReportService } from '../report/report.service';
import { OfferService } from '../deal/offer.service';
import { IsSuccessResponse } from '../../common/models';
import { AuthService } from '../auth/auth.service';
import { GraphQLError } from 'graphql';

@Resolver(() => Seller)
export class SellerResolver extends UserResolver {
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
  @Query(() => Seller, { name: 'seller' })
  async seller(@Token('clientAccountId') clientAccountId: string) {
    return await this.userService.getSellerByClientAccountId(clientAccountId);
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => UpdateSellerResponse)
  async updateSeller(
    @Token('clientAccountId') clientAccountId: string,
    @Args('params') params: UpdateSellerRequest,
  ): Promise<IUpdateUserResponse<ISeller>> {
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
    return await this.userService.updateSeller(params, clientAccountId);
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async updateSellerSetting(
    @Token('userId') userId: string,
    @Args('params') params: UpdateSellerSettingRequest,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.userService.updateSellerSetting({
      userId,
      setting: { ...params },
    });
  }
}
