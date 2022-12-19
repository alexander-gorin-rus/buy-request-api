import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import {
  GetProductsInput,
  Product,
  ProductFilterInput,
  ProductForOfferFilterInput,
} from './models/product.model';
import { UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { IsSuccessResponse } from '../../common/models';
import { Token } from '../../common/decorators/token.decorator';
import { Tag } from './models/tag.model';
import { ITag } from './interface/tag.interface';
import { TagService } from './tag.service';
import { GetRatingsResponse } from '../rating/models/rating.model';
import { RatingService } from '../rating/rating.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly tagService: TagService,
    private readonly ratingService: RatingService,
  ) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async createProduct(
    @Args('createProductData') createProductData?: CreateProductInput,
  ) {
    return await this.productService.createProduct({
      product: createProductData,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async deleteProduct(@Args('id') id: string) {
    return await this.productService.deleteProduct({
      id,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Query(() => GetProductsInput)
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

  @UseGuards(UnregisteredUserGuard)
  @Query(() => GetProductsInput)
  async productsForOffer(
    @Args('productForOfferFilterInput')
    productForOfferFilterInput?: ProductForOfferFilterInput,
  ) {
    const { page, perPage, sort, tagNames, productIds } =
      productForOfferFilterInput;
    return await this.productService.getProductsForOffer({
      sort,
      tagNames,
      productIds,
      page,
      perPage,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async updateProduct(
    @Args('updateProductData') updateProductData: UpdateProductInput,
  ) {
    return await this.productService.updateProduct({
      product: updateProductData,
    });
  }

  @ResolveField('tagsData', () => [Tag], { nullable: true })
  async tags(@Parent() products: Product): Promise<ITag[]> {
    const res = [];
    const { tags } = products;
    for (const tag of tags) {
      const {
        data: [tagEntity],
      } = await this.tagService.getTags(tag);
      res.push(tagEntity);
    }
    return res;
  }

  @ResolveField('rating', () => GetRatingsResponse, { nullable: true })
  async rating(@Parent() product: Product): Promise<GetRatingsResponse> {
    const { id } = product;
    return await this.ratingService.getEntityRatings(id);
  }
}
