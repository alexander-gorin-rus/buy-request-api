import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  BaseFilter,
  DefaultDBItem,
  Media,
  MediaInput,
  PaginatedInput,
} from '../../../common/models';
import { Product } from '../../product/models/product.model';
import { EOfferStatus, IMedia } from '../interface/offer.interface';
import { Deal } from './deal.model';
import { IDeal } from '../interface/deal.interface';

registerEnumType(EOfferStatus, {
  name: 'EOfferStatus',
});

@ObjectType()
export class Offer extends DefaultDBItem {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  requestId: string;

  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  title?: string;

  @Field(() => Boolean)
  ecogood: boolean;

  @Field(() => EOfferStatus)
  status: EOfferStatus;

  @Field(() => Boolean)
  isDraft: boolean;

  @Field(() => String)
  additionalConditions?: string;

  @Field(() => String)
  cover?: string;

  @Field(() => Product, { nullable: true })
  product?: Product;

  @Field(() => [MediaOffer], { nullable: true })
  media?: IMedia[];

  @Field(() => Deal, { nullable: true })
  deal?: IDeal;
}

@ObjectType()
export class GetOffersResponseInput extends PaginatedInput {
  @Field(() => [Offer])
  data?: Offer[] | [];
}

@ObjectType()
export class MediaOffer extends Media {
  @Field(() => String)
  bucket: 'offer' | 'product';
}

@InputType()
export class MediaOfferInput extends MediaInput {
  @Field(() => String)
  bucket: 'offer' | 'product';
}

@InputType()
export class OfferFilterInput extends BaseFilter {
  @Field(() => String, { nullable: true })
  offerId?: string;

  @Field(() => [EOfferStatus], { nullable: true, defaultValue: 'CREATED' })
  statuses?: EOfferStatus[];
}
