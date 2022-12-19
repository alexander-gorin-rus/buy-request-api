import {
  Field,
  ID,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { EDealStatus } from '../interface/deal.interface';
import { Offer } from './offer.model';
import { Request } from '../../request/models/request.model';
import {
  BaseFilter,
  DefaultDBItem,
  IsSuccessResponse,
  PaginatedInput,
} from '../../../common/models';

registerEnumType(EDealStatus, {
  name: 'EDealStatus',
});

@ObjectType()
export class Deal extends DefaultDBItem {
  @Field(() => ID)
  offerId: string;

  @Field(() => ID)
  sellerId: string;

  @Field(() => ID)
  consumerId: string;

  @Field(() => EDealStatus)
  status?: EDealStatus;

  @Field(() => String, { nullable: true })
  additionalConditions: string;

  @Field(() => String)
  expiratedAt?: string;

  @Field(() => Offer, { nullable: true })
  offers?: Offer;

  @Field(() => Request, { nullable: true })
  request?: Request;
}

@ObjectType()
export class CreateDealResponse extends IsSuccessResponse {
  @Field(() => ID)
  id: string;
}

@InputType()
export class CreateDealRequest {
  @Field(() => ID)
  requestId: string;

  @Field(() => ID)
  offerId: string;

  @Field(() => ID)
  sellerId: string;

  @Field(() => ID)
  consumerId: string;

  @Field(() => EDealStatus, { nullable: true })
  status?: EDealStatus;

  @Field(() => String, { nullable: true })
  additionalConditions: string;

  @Field(() => String, { nullable: true })
  expiratedAt?: string;
}

@InputType()
export class UpdateDealRequest {
  @Field(() => ID)
  id: string;

  @Field(() => EDealStatus)
  status: EDealStatus;

  @Field(() => String, { nullable: true })
  additionalConditions: string;
}

@ObjectType()
export class IGetDealResponseInput extends PaginatedInput {
  @Field(() => [Deal])
  data?: Deal[];
}

@InputType()
export class DealFilterInput extends BaseFilter {
  @Field(() => String, { nullable: true })
  dealId?: string;

  @Field(() => [EDealStatus], {
    nullable: true,
  })
  statuses?: EDealStatus[];
}
