import {
  ArgsType,
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  BaseFilter,
  DefaultDBItem,
  Media,
  PaginatedInput,
} from '../../../common/models';
import { IMedia, ProductStatus } from '../interface/product.interface';
import { Tag } from './tag.model';
import { ITag } from '../interface/tag.interface';

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});

@ObjectType()
export class Product extends DefaultDBItem {
  @Field(() => String)
  production: string;

  @Field(() => ID)
  userId: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  model: string;

  @Field(() => String)
  productionGuarantee: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => String)
  description: string;

  @Field(() => [Media])
  media: IMedia[];

  @Field(() => String)
  cover: string;

  @Field(() => ProductStatus)
  status?: ProductStatus;

  @Field(() => [Tag])
  tagsData?: ITag[];
}

@ObjectType()
export class GetProductsInput extends PaginatedInput {
  @Field(() => [Product])
  data?: Product[];
}

@InputType()
export class ProductFilterInput extends BaseFilter {
  @Field(() => String, { nullable: true })
  productId?: string;

  @Field(() => Boolean, { nullable: true })
  myOwnProduct?: boolean;
}

@InputType()
export class ProductForOfferFilterInput extends BaseFilter {
  @Field(() => [String], { nullable: true })
  tagNames: string[];

  @Field(() => [String], { nullable: true })
  productIds: string[];
}

@ArgsType()
export class ProductArgs {
  @Field(() => String, { nullable: true })
  productId?: string;

  @Field(() => Boolean, { nullable: true })
  myOwnProduct?: boolean;
}
