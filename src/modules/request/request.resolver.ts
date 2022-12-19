import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RequestService } from './request.service';
import { UserService } from '../user/user.service';
import { RatingService } from '../rating/rating.service';
import { GetRatingsResponse } from '../rating/models/rating.model';
import { CreateRequestInput } from './dto/input/create-request.input';
import { ICommonIsSuccessResponse } from './interface/request.interface';
import { Request, RequestAuthor } from './models/request.model';
import { Token } from '../../common/decorators/token.decorator';
import { UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { IsSuccessResponse } from '../../common/models';
import { User } from '../user/models/user.model';
import { Product } from '../product/models/product.model';
import { IRequest } from '../request/interface/request.interface';
import { Cookie } from '../../common/decorators/cookie.decorator';
import { UpdateRequestInput } from './dto/input/update-request.input';
import { ProductService } from '../product/product.service';
import { Tag } from '../product/models/tag.model';
import { ITag } from '../product/interface/tag.interface';
import { TagService } from '../product/tag.service';

@Resolver(() => Request)
export class RequestResolver {
  constructor(
    private readonly requestService: RequestService,
    protected userService: UserService,
    protected ratingService: RatingService,
    protected productService: ProductService,
    protected tagService: TagService,
  ) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async createRequest(
    @Cookie('locale') locale = 'RU',
    @Token('userId') userId: string,
    @Args('createRequestData') createRequestData: CreateRequestInput,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.requestService.createRequest(locale, {
      userId,
      ...createRequestData,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async updateRequest(
    @Args('updateRequestInput') updateRequestInput: UpdateRequestInput,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.requestService.updateRequest(updateRequestInput);
  }

  @ResolveField('requestAuthor', () => RequestAuthor)
  async requestAuthor(@Parent() user: User): Promise<RequestAuthor> {
    return await this.userService.getUserById(user.userId);
  }

  @ResolveField('ratingUser', () => GetRatingsResponse, { nullable: true })
  async rating(@Parent() request: IRequest): Promise<GetRatingsResponse> {
    return await this.ratingService.getUserRatings(request.userId);
  }

  @ResolveField('products', () => [Product], { nullable: true })
  async product(@Parent() request: IRequest): Promise<Product[]> {
    const data = [];
    const { products } = request;
    for await (const product of products) {
      const resProduct = await this.productService.getProducts({
        productId: product,
      });
      if (resProduct.data.length) {
        data.push(resProduct.data[0]);
      }
    }
    return data;
  }

  @ResolveField('tagsData', () => [Tag], { nullable: true })
  async tags(@Parent() request: Request): Promise<ITag[]> {
    const res = [];
    const { tags } = request;
    for (const tag of tags) {
      const {
        data: [tagEntity],
      } = await this.tagService.getTags(tag);
      res.push(tagEntity);
    }
    return res;
  }
}
