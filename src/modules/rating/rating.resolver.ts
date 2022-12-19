import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateRatingRequest, Rating } from './models/rating.model';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { ICreateRatingResponse } from './interfaces/rating.interface';
import { IsSuccessResponse } from '../../common/models';
import { Token } from '../../common/decorators/token.decorator';

@Resolver(() => Rating)
export class RatingResolver {
  constructor(private ratingService: RatingService) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async createRating(
    @Args('newRating') newRating: CreateRatingRequest,
    @Token('userId') userId?: string,
  ): Promise<ICreateRatingResponse> {
    return await this.ratingService.createRating({
      ...newRating,
      authorId: userId,
    });
  }
}
