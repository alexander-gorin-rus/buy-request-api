import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OfferService } from './offer.service';
import { Offer } from './models/offer.model';
import { Token } from '../../common/decorators/token.decorator';
import { UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { CreateOfferInput } from './dto/input/create-offer.input';
import { UpdateOfferInput } from './dto/input/update-offer.input';
import { RequestService } from '../request/request.service';
import { Product } from '../product/models/product.model';
import { ProductService } from '../product/product.service';
import { IsSuccessResponse } from '../../common/models';
import { IOffer } from './interface/offer.interface';
import { RatingService } from '../rating/rating.service';
import { UserService } from '../user/user.service';
import { GetRatingsResponse } from '../rating/models/rating.model';
import { User } from '../user/models/user.model';

@Resolver(() => Offer)
export class OfferResolver {
  constructor(
    private readonly offerService: OfferService,
    private readonly requestService: RequestService,
    private readonly productService: ProductService,
    private readonly ratingService: RatingService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async createOffer(
    @Token('userId') userId: string,
    @Args('createOfferData') createOfferData: CreateOfferInput,
  ) {
    return await this.offerService.createOffer({
      offer: {
        userId,
        ...createOfferData,
      },
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async deleteOffer(@Args('id') id: string) {
    return await this.offerService.deleteOffer({
      id,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async updateOffer(@Args('updateOfferData') offer: UpdateOfferInput) {
    return await this.offerService.updateOffer({
      offer,
    });
  }

  @ResolveField('product', () => Product, { nullable: true })
  async product(@Parent() offer: IOffer): Promise<Product> {
    const { productId } = offer;
    const data = await this.productService.getProducts({
      productId,
    });
    return data.data[0];
  }

  @ResolveField('ratingUser', () => GetRatingsResponse, { nullable: true })
  async rating(@Parent() offer: IOffer): Promise<GetRatingsResponse> {
    const { userId } = offer;
    return await this.ratingService.getUserRatings(userId);
  }

  @ResolveField('offerAuthor', () => User, { nullable: true })
  async user(@Parent() offer: IOffer): Promise<GetRatingsResponse> {
    const { userId } = offer;
    return await this.userService.getUserById(userId);
  }
}
